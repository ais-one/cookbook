# ── App assets bucket (private) ───────────────────────────────
resource "aws_s3_bucket" "app" {
  bucket = var.s3_app_bucket
  lifecycle { prevent_destroy = true }
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app" {
  bucket = aws_s3_bucket.app.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket                  = aws_s3_bucket.app.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "app" {
  bucket = aws_s3_bucket.app.id
  rule {
    id     = "transition"
    status = "Enabled"
    filter { prefix = "" }
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

# ── Static website bucket ─────────────────────────────────────
resource "aws_s3_bucket" "static" {
  bucket = var.s3_static_bucket
  lifecycle { prevent_destroy = true }
}

resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

# Static site: access via CloudFront OAC only — bucket stays private
resource "aws_s3_bucket_public_access_block" "static" {
  bucket                  = aws_s3_bucket.static.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "static" {
  bucket = aws_s3_bucket.static.id
  index_document { suffix = "index.html" }
  error_document { key    = "error.html" }
}

# OAC — Origin Access Control (modern replacement for OAI)
resource "aws_cloudfront_origin_access_control" "static" {
  name                              = "${var.project}-${var.env}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Bucket policy — only CloudFront can read objects
resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.static.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.static.arn
        }
      }
    }]
  })
}

resource "aws_s3_bucket_lifecycle_configuration" "static" {
  bucket = aws_s3_bucket.static.id
  rule {
    id     = "expire-old-deploys"
    status = "Enabled"
    filter { prefix = "deploys/" }
    expiration { days = 30 }
  }
}
