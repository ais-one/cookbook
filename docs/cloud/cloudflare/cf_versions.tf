terraform {
  required_version = ">= 1.9.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36"
    }
  }

  # Reuse the same remote state backend as your cloud stack
  # (either AWS S3 or AliCloud OSS — pick one)
  backend "s3" {
    bucket         = "my-org-terraform-state"
    key            = "cloudflare/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "cloudflare" {
  # Inject via: export CLOUDFLARE_API_TOKEN="..."
  # Create a token at: https://dash.cloudflare.com/profile/api-tokens
  # Required permissions:
  #   Zone:Zone:Read, Zone:DNS:Edit, Zone:Cache Rules:Edit,
  #   Zone:WAF:Edit, Zone:Page Rules:Edit, Account:Account Settings:Read
  api_token = var.cloudflare_api_token
}
