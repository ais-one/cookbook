terraform {
  required_version = "~> 1.0"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  # backend "s3" {
  #   bucket = "yourdomain-terraform"
  #   key = "prod/terraform.tfstate"
  #   region = "eu-west-1"
  # }
}
provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region = "${var.aws_region}"
}
