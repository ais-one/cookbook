# ============================================================
# backend.tf — Terraform OSS backend configuration
# ============================================================
terraform {
  backend "oss" {
    bucket              = "my-org-terraform-state"
    prefix              = "envs/prod"        # acts like a folder path in the bucket
    key                 = "terraform.tfstate"
    region              = "cn-hangzhou"
    encrypt             = true

    # TableStore locking
    tablestore_endpoint = "https://terraform-lock.cn-hangzhou.ots.aliyuncs.com"
    tablestore_table    = "tfstate-lock"

    # No access_key or secret_key here!
    # Credentials come from the assumed RAM role at runtime.
  }
}

# ============================================================
# provider.tf — AliCloud provider (role assumption via OIDC)
# ============================================================
provider "alicloud" {
  region = "cn-hangzhou"

  # The provider picks up ALIBABA_CLOUD_* env vars injected by the
  # GitHub Actions OIDC step — no credentials hardcoded here.
  # Optionally pin the role explicitly:
  # assume_role {
  #   role_arn = "acs:ram::123456789012345678:role/cicd-terraform-role"
  # }
}
