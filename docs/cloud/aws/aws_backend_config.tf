# ============================================================
# backend.tf — Terraform S3 backend configuration
# ============================================================
terraform {
  backend "s3" {
    bucket         = "my-org-terraform-state"
    key            = "envs/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true

    # No access_key or secret_key here!
    # Credentials come from the assumed IAM role at runtime.
  }
}

# ============================================================
# provider.tf — AWS provider (role assumption via OIDC)
# ============================================================
provider "aws" {
  region = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::123456789012:role/cicd-terraform-role"
  }
}
