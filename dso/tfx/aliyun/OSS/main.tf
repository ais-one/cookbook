provider "alicloud" {
  access_key = "LTAI5tPaWYgnWMiKJDE9aQQ2"
  secret_key = "KOwM9Xngdq1OFNDQkD5pkBoyMnjTr8"
  region = "ap-southeast-1"
}

resource "alicloud_oss_bucket" "bucket-website" {
  bucket = "bucket-website--something-that-is-unique"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
  acl    = "public-read"
}

# file upload
resource "alicloud_oss_bucket_object" "index" {
  bucket = alicloud_oss_bucket.bucket-website.bucket
  key    = "index.html"
  source = "/root/terraform/index.html"
  acl    = "public-read"
}

# file upload
resource "alicloud_oss_bucket_object" "error" {
  bucket = alicloud_oss_bucket.bucket-website.bucket
  key    = "error.html"
  source = "/root/terraform/error.html"
  acl    = "public-read"
}

output "oss_id" {
  description = "oss id"
  value       = alicloud_oss_bucket.bucket-website.id
}

