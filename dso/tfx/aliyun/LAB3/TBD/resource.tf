resource "alicloud_oss_bucket" "bucket-acl" {
  bucket = "bucket-170309-acl"
  acl    = "private"
}

resource "alicloud_oss_bucket" "bucket-website" {
  bucket = "bucket-170309-website"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "alicloud_oss_bucket" "bucket-target" {
  bucket = "bucket-170309-acl"
  acl    = "public-read"
}

resource "alicloud_oss_bucket" "bucket-logging" {
  bucket = "bucket-170309-logging"

  logging {
    target_bucket = alicloud_oss_bucket.bucket-target.id
    target_prefix = "log/"
  }
}