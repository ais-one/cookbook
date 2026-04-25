# ============================================================
# 1. OIDC Identity Provider (GitHub Actions example)
# ============================================================
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint (stable — rotate only if GitHub changes their cert)
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# ============================================================
# 2. IAM Role that the CI/CD pipeline will assume
# ============================================================
data "aws_iam_policy_document" "cicd_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Scope to a specific repo and branch (adjust as needed)
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      # Format: repo:<org>/<repo>:ref:refs/heads/<branch>
      # Use "*" to allow all branches, or lock to "main" for safety
      values   = ["repo:my-org/my-repo:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "cicd_terraform" {
  name               = "cicd-terraform-role"
  assume_role_policy = data.aws_iam_policy_document.cicd_assume_role.json

  # Short session — credentials expire quickly
  max_session_duration = 3600 # 1 hour
}

# ============================================================
# 3. Least-privilege policy for Terraform state operations
# ============================================================
data "aws_iam_policy_document" "terraform_state" {
  # S3: read/write state files
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.tfstate.arn,
      "${aws_s3_bucket.tfstate.arn}/*",
    ]
  }

  # DynamoDB: state locking
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [aws_dynamodb_table.tfstate_lock.arn]
  }

  # Add your Terraform-managed resource permissions below
  # e.g. "ec2:*", "s3:*", etc. — scope tightly per environment
}

resource "aws_iam_role_policy" "terraform_state" {
  name   = "terraform-state-access"
  role   = aws_iam_role.cicd_terraform.id
  policy = data.aws_iam_policy_document.terraform_state.json
}

# ============================================================
# 4. S3 bucket for Terraform state
# ============================================================
resource "aws_s3_bucket" "tfstate" {
  bucket = "my-org-terraform-state"

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================================
# 5. DynamoDB table for state locking
# ============================================================
resource "aws_dynamodb_table" "tfstate_lock" {
  name         = "terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
