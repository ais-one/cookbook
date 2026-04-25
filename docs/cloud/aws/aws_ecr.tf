# ── ECR repositories ─────────────────────────────────────────
resource "aws_ecr_repository" "app" {
  for_each = toset(var.ecr_repos)

  name                 = "${var.project}/${each.value}"
  image_tag_mutability = "IMMUTABLE"   # prevents overwriting tagged images

  image_scanning_configuration {
    scan_on_push = true   # automatic vulnerability scan on every push
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = { Name = "${var.project}/${each.value}" }
}

# Lifecycle policy — keep last 10 tagged images, expire untagged after 7 days
resource "aws_ecr_lifecycle_policy" "app" {
  for_each   = aws_ecr_repository.app
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep last 10 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "sha-"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = { type = "expire" }
      }
    ]
  })
}

# IAM policy allowing Lambda + ECS to pull from ECR
resource "aws_iam_policy" "ecr_pull" {
  name        = "${var.project}-${var.env}-ecr-pull"
  description = "Read-only ECR pull access for Lambda and ECS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ]
        Resource = "*"
      }
    ]
  })
}
