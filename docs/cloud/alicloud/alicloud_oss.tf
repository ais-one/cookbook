# ============================================================
# Static website hosting bucket
# ============================================================
resource "alicloud_oss_bucket" "static" {
  bucket        = var.oss_static_bucket_name
  storage_class = "Standard"
  force_destroy = false
}

resource "alicloud_oss_bucket_acl" "static" {
  bucket = alicloud_oss_bucket.static.bucket
  acl    = "public-read" # required for static hosting
}

resource "alicloud_oss_bucket_website" "static" {
  bucket = alicloud_oss_bucket.static.bucket

  index_document {
    suffix           = "index.html"
    support_sub_dir  = true
    type             = "0" # 0 = redirect to index, 1 = fixed, 2 = pass-through
  }

  error_document {
    key       = "error.html"
    http_status = "404"
  }
}

resource "alicloud_oss_bucket_cors" "static" {
  bucket = alicloud_oss_bucket.static.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# Lifecycle: expire old deploy artifacts after 30 days
resource "alicloud_oss_bucket_lifecycle_rule" "static" {
  bucket = alicloud_oss_bucket.static.bucket

  rule {
    id      = "expire-old-deploys"
    enabled = true
    prefix  = "deploys/"

    expiration {
      days = 30
    }
  }
}


resource "alicloud_oss_bucket" "app" {
  bucket        = var.oss_bucket_name
  storage_class = "Standard"
  force_destroy = false
}

resource "alicloud_oss_bucket_acl" "app" {
  bucket = alicloud_oss_bucket.app.bucket
  acl    = "private"
}

resource "alicloud_oss_bucket_versioning" "app" {
  bucket = alicloud_oss_bucket.app.bucket
  status = "Enabled"
}

resource "alicloud_oss_bucket_server_side_encryption_rule" "app" {
  bucket        = alicloud_oss_bucket.app.bucket
  sse_algorithm = "AES256"
}

# Lifecycle: move objects to IA after 30 days, archive after 90
resource "alicloud_oss_bucket_lifecycle_rule" "app" {
  bucket = alicloud_oss_bucket.app.bucket

  rule {
    id      = "transition-to-ia"
    enabled = true
    prefix  = ""

    transitions {
      days          = 30
      storage_class = "IA"
    }

    transitions {
      days          = 90
      storage_class = "Archive"
    }
  }
}

# CORS — adjust origins to match your app domain
resource "alicloud_oss_bucket_cors" "app" {
  bucket = alicloud_oss_bucket.app.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["https://myapp.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}
