# ============================================================
# 1. RAM OIDC Provider (GitHub Actions example)
# ============================================================
resource "alicloud_ram_oidc_provider" "github" {
  oidc_provider_name = "github-actions"
  issuer_url         = "https://token.actions.githubusercontent.com"

  # GitHub's OIDC thumbprint
  fingerprints = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  client_ids = ["sts.aliyuncs.com"]
}

# ============================================================
# 2. RAM Role that the CI/CD pipeline will assume
# ============================================================
resource "alicloud_ram_role" "cicd_terraform" {
  name        = "cicd-terraform-role"
  description = "Assumed by GitHub Actions via OIDC for Terraform"

  # Trust policy — allows OIDC-authenticated subjects to assume this role
  document = jsonencode({
    Statement = [
      {
        Action = "sts:AssumeRoleWithOIDC"
        Effect = "Allow"
        Principal = {
          Federated = [alicloud_ram_oidc_provider.github.arn]
        }
        Condition = {
          StringEquals = {
            # Scope to your specific GitHub repo and branch
            "oidc:sub" = "repo:my-org/my-repo:ref:refs/heads/main"
            "oidc:aud" = "sts.aliyuncs.com"
          }
        }
      }
    ]
    Version = "1"
  })

  max_session_duration = 3600
}

# ============================================================
# 3. Least-privilege policy for Terraform state operations
# ============================================================
resource "alicloud_ram_policy" "terraform_state" {
  policy_name        = "terraform-state-access"
  policy_description = "Allows Terraform CI/CD to read/write OSS state and lock via TableStore"

  document = jsonencode({
    Version = "1"
    Statement = [
      # OSS: read/write state files
      {
        Effect = "Allow"
        Action = [
          "oss:PutObject",
          "oss:GetObject",
          "oss:DeleteObject",
          "oss:ListObjects",
          "oss:HeadObject",
        ]
        Resource = [
          "acs:oss:*:*:my-org-terraform-state",
          "acs:oss:*:*:my-org-terraform-state/*",
        ]
      },
      # TableStore: state locking
      {
        Effect = "Allow"
        Action = [
          "ots:GetRow",
          "ots:PutRow",
          "ots:DeleteRow",
          "ots:DescribeTable",
        ]
        Resource = "acs:ots:*:*:instance/terraform-lock/table/tfstate-lock"
      },
      # Add your Terraform-managed resource permissions below
      # e.g. "ecs:*", "vpc:*" etc. — scope tightly per environment
    ]
  })
}

resource "alicloud_ram_role_policy_attachment" "terraform_state" {
  role_name   = alicloud_ram_role.cicd_terraform.name
  policy_name = alicloud_ram_policy.terraform_state.policy_name
  policy_type = "Custom"
}

# ============================================================
# 4. OSS bucket for Terraform state
# ============================================================
resource "alicloud_oss_bucket" "tfstate" {
  bucket = "my-org-terraform-state"

  # Prevent accidental deletion
  force_destroy = false
}

resource "alicloud_oss_bucket_versioning" "tfstate" {
  bucket = alicloud_oss_bucket.tfstate.bucket
  status = "Enabled"
}

resource "alicloud_oss_bucket_server_side_encryption_rule" "tfstate" {
  bucket          = alicloud_oss_bucket.tfstate.bucket
  sse_algorithm   = "AES256"
}

resource "alicloud_oss_bucket_acl" "tfstate" {
  bucket = alicloud_oss_bucket.tfstate.bucket
  acl    = "private"
}

# ============================================================
# 5. TableStore instance + table for state locking
# ============================================================
resource "alicloud_ots_instance" "tfstate_lock" {
  name        = "terraform-lock"
  description = "Terraform state locking"
  # Use "SSD" for production, "HYBRID" for cost savings
  instance_type = "SSD"
}

resource "alicloud_ots_table" "tfstate_lock" {
  instance_name = alicloud_ots_instance.tfstate_lock.name
  table_name    = "tfstate-lock"

  primary_key {
    name = "LockID"
    type = "String"
  }

  # State locks are short-lived — TTL of 24h is a safe fallback
  time_to_live                  = 86400
  max_version                   = 1
  deviation_cell_version_in_sec = 86400
}
