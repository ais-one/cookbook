# ── IAM role for Lambda ───────────────────────────────────────
resource "aws_iam_role" "lambda" {
  name = "${var.project}-${var.env}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_ecr" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.ecr_pull.arn
}

resource "aws_iam_role_policy" "lambda_s3" {
  name = "s3-app-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
      Resource = [aws_s3_bucket.app.arn, "${aws_s3_bucket.app.arn}/*"]
    }]
  })
}

# ── Lambda function (container image) ────────────────────────
resource "aws_lambda_function" "app" {
  function_name = "${var.project}-${var.env}-handler"
  role          = aws_iam_role.lambda.arn
  package_type  = "Image"

  # Pin to a specific image digest in production — never :latest
  image_uri = "${aws_ecr_repository.app["app-lambda"].repository_url}:1.0.0"

  memory_size = 512
  timeout     = 60

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_instance.pg.address
      DB_PORT     = "5432"
      DB_NAME     = var.pg_db_name
      DB_USER     = var.pg_username
      REDIS_HOST  = aws_elasticache_replication_group.redis.primary_endpoint_address
      REDIS_PORT  = "6379"
      S3_BUCKET   = aws_s3_bucket.app.bucket
      ENVIRONMENT = var.env
    }
  }

  # X-Ray tracing
  tracing_config { mode = "Active" }

  lifecycle {
    ignore_changes = [image_uri]   # deployments update this via CI/CD
  }

  tags = { Name = "${var.project}-${var.env}-lambda" }
}

# ── CloudWatch log group for Lambda ──────────────────────────
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.app.function_name}"
  retention_in_days = 30
}

# ── Lambda permission — allow ALB to invoke ───────────────────
resource "aws_lambda_permission" "alb" {
  statement_id  = "AllowALBInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb_target_group.lambda.arn
}
