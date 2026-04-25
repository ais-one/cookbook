# ── ECS Cluster ───────────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "${var.project}-${var.env}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = var.ecs_replicas
  }
}

# ── IAM roles for ECS ─────────────────────────────────────────
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project}-${var.env}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_ecr" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.ecr_pull.arn
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.project}-${var.env}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "s3-access"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
      Resource = [aws_s3_bucket.app.arn, "${aws_s3_bucket.app.arn}/*"]
    }]
  })
}

# ── CloudWatch log group ──────────────────────────────────────
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project}-${var.env}"
  retention_in_days = 30
}

# ── Task definition ───────────────────────────────────────────
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project}-${var.env}-app"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory

  execution_role_arn = aws_iam_role.ecs_task_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = var.ecs_app_name
    # Pin to a specific digest — CI/CD updates this, not Terraform
    image = "${aws_ecr_repository.app["app-ecs"].repository_url}:1.0.0"
    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]
    environment = [
      { name = "DB_HOST",     value = aws_db_instance.pg.address },
      { name = "DB_PORT",     value = "5432" },
      { name = "DB_NAME",     value = var.pg_db_name },
      { name = "DB_USER",     value = var.pg_username },
      { name = "REDIS_HOST",  value = aws_elasticache_replication_group.redis.primary_endpoint_address },
      { name = "REDIS_PORT",  value = "6379" },
      { name = "S3_BUCKET",   value = aws_s3_bucket.app.bucket },
      { name = "ENVIRONMENT", value = var.env },
    ]
    healthCheck = {
      command     = ["CMD-SHELL", "curl -sf http://localhost:8080/health || exit 1"]
      interval    = 10
      timeout     = 5
      retries     = 3
      startPeriod = 15
    }
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
        "awslogs-region"        = var.region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  lifecycle {
    ignore_changes = [container_definitions]   # CI/CD owns image updates
  }
}

# ── ECS Service ───────────────────────────────────────────────
resource "aws_ecs_service" "app" {
  name            = var.ecs_app_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.ecs_replicas
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs.arn
    container_name   = var.ecs_app_name
    container_port   = 8080
  }

  # Rolling deploy — keep at least 1 healthy during deployment
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true   # auto-rollback if deployment fails health checks
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  depends_on = [aws_lb_listener.https]
}

# ── Auto Scaling ──────────────────────────────────────────────
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 10
  min_capacity       = var.ecs_replicas
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_cpu" {
  name               = "${var.project}-${var.env}-ecs-cpu-scaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
