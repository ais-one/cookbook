# ── Application Load Balancer ─────────────────────────────────
resource "aws_lb" "main" {
  name               = "${var.project}-${var.env}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2               = true

  access_logs {
    bucket  = aws_s3_bucket.app.bucket
    prefix  = "alb-logs"
    enabled = true
  }

  tags = { Name = "${var.project}-${var.env}-alb" }
}

# ── Target group: Lambda ──────────────────────────────────────
resource "aws_lb_target_group" "lambda" {
  name        = "${var.project}-${var.env}-lambda-tg"
  target_type = "lambda"

  health_check {
    enabled             = true
    path                = "/health"
    interval            = 35
    timeout             = 30
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-299"
  }
}

resource "aws_lb_target_group_attachment" "lambda" {
  target_group_arn = aws_lb_target_group.lambda.arn
  target_id        = aws_lambda_function.app.arn
  depends_on       = [aws_lambda_permission.alb]
}

# ── Target group: ECS ─────────────────────────────────────────
resource "aws_lb_target_group" "ecs" {
  name        = "${var.project}-${var.env}-ecs-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/health"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-299"
  }
}

# ── HTTPS Listener (port 443) ─────────────────────────────────
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.acm_cert_arn

  # Default: forward to ECS
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs.arn
  }
}

# Route /api/fn/* to Lambda, everything else to ECS
resource "aws_lb_listener_rule" "lambda_path" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  condition {
    path_pattern { values = ["/api/fn/*"] }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lambda.arn
  }
}

# ── HTTP → HTTPS redirect (port 80) ──────────────────────────
resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
