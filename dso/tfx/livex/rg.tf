# create SSL cert

## WWW Cert
# resource "alicloud_ssl_certificates_service_certificate" "tlc-www-ssl" {
#   certificate_name = "tlc-www-ssl-2023"
#   cert             = file("${path.module}/test.crt")
#   key              = file("${path.module}/test.key")
# }

## API Cert
# resource "alicloud_ssl_certificates_service_certificate" "tlc-api-ssl" {
#   certificate_name = "tlc-api-ssl-2023"
#   cert             = file("${path.module}/test.crt")
#   key              = file("${path.module}/test.key")
# }


# data "alicloud_cas_certificates" "certs" {
#   name_regex = "^cas"
#   ids        = ["Certificate Id"]
# }

# output "cert" {
#   value = data.alicloud_cas_certificates.certs.certificates.0.id
# }


# setup resource group
resource "alicloud_resource_manager_resource_group" "tlc_rg" {
  resource_group_name = "rg-tlc"
  display_name        = "TLC Resource Group"
}

data "alicloud_resource_manager_resource_groups" "tlc_rg" {
  name_regex = "tlc"
}

output "tlc_rg_id" {
  value = "${data.alicloud_resource_manager_resource_groups.tlc_rg.groups.0}"
}

# resource_group_id

resource "alicloud_oss_bucket" "tlc-oss-www" {
  bucket = "tlc-oss-www"
  acl    = "public-read"
  # resource_group_id = "abc"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "alicloud_oss_bucket" "tlc-oss-fs" {
  bucket = "tlc-oss-fs"
  acl    = "private"
}

output "oss_tlc_www_id" {
  description = "oss id"
  value       = alicloud_oss_bucket.tlc-oss-www.id
}

output "oss_tlc_fs_id" {
  description = "oss id"
  value       = alicloud_oss_bucket.tlc-oss-fs.id
}