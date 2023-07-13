terraform {
  required_providers {
    alicloud = {
      source = "aliyun/alicloud"
      version = "1.200.0"
    }
  }
}

variable "aliyun_access_key" { }
variable "aliyun_secret_key" { }
variable "aliyun_region" { }

# Configure the Alicloud Provider
provider "alicloud" {
  access_key="${var.aliyun_access_key}"
  secret_key=var.aliyun_secret_key
  region="${var.aliyun_region}"
}

output "region" { value = "${var.aliyun_region}" }
