# ── Cache policies ────────────────────────────────────────────

# Long-lived cache for hashed assets (JS, CSS, fonts, images)
resource "aws_cloudfront_cache_policy" "assets" {
  name        = "${var.project}-${var.env}-assets"
  default_ttl = 2592000   # 30 days
  max_ttl     = 31536000  # 1 year
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config  { cookie_behavior  = "none" }
    headers_config  { header_behavior  = "none" }
    query_strings_config { query_string_behavior = "none" }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# Short cache for HTML
resource "aws_cloudfront_cache_policy" "html" {
  name        = "${var.project}-${var.env}-html"
  default_ttl = 300   # 5 minutes
  max_ttl     = 600
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config  { cookie_behavior  = "none" }
    headers_config  { header_behavior  = "none" }
    query_strings_config { query_string_behavior = "none" }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# ── CloudFront distribution ───────────────────────────────────
resource "aws_cloudfront_distribution" "static" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  default_root_object = "index.html"
  aliases             = ["static.${var.domain_name}"]
  price_class         = "PriceClass_All"
  web_acl_id          = aws_wafv2_web_acl.cloudfront.arn

  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "s3-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.static.id
  }

  # Default: serve index.html with short TTL
  default_cache_behavior {
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.html.id
    compress               = true

    response_headers_policy_id = aws_cloudfront_response_headers_policy.static.id
  }

  # Hashed assets — long TTL
  ordered_cache_behavior {
    path_pattern           = "*.js"
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.assets.id
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern           = "*.css"
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.assets.id
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.assets.id
    compress               = true
  }

  # SPA fallback — return index.html for unknown paths (client-side routing)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_cert_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = { Name = "${var.project}-${var.env}-cf" }
}

# ── Security headers policy ───────────────────────────────────
resource "aws_cloudfront_response_headers_policy" "static" {
  name = "${var.project}-${var.env}-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options  { override = true }
    frame_options         { frame_option = "DENY"; override = true }
    xss_protection        { mode_block = true; protection = true; override = true }
    referrer_policy       { referrer_policy = "strict-origin-when-cross-origin"; override = true }

    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://${var.domain_name};"
      override                = true
    }
  }

  cors_config {
    access_control_allow_credentials = false
    access_control_allow_headers     { items = ["*"] }
    access_control_allow_methods     { items = ["GET", "HEAD", "OPTIONS"] }
    access_control_allow_origins     { items = ["https://${var.domain_name}"] }
    access_control_max_age_sec       = 3600
    origin_override                  = true
  }
}
