terraform {
  required_version = ">= 1.9.0"

  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "~> 1.220"
    }
  }

  backend "oss" {
    bucket              = "my-org-terraform-state"
    prefix              = "envs/prod"
    key                 = "terraform.tfstate"
    region              = "ap-southeast-1"
    encrypt             = true
    tablestore_endpoint = "https://terraform-lock.ap-southeast-1.ots.aliyuncs.com"
    tablestore_table    = "tfstate-lock"
  }
}

provider "alicloud" {
  region = var.region
}
