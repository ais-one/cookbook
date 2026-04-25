# ============================================================
# DCDN Domain — AliCloud's Dynamic CDN supports both static
# and dynamic content acceleration (unlike standard CDN).
# Origin: the static OSS bucket's public endpoint.
# ============================================================
resource "alicloud_dcdn_domain" "static" {
  domain_name = "static.${var.domain_name}"   # e.g. static.api.myapp.com
  scope       = "overseas"  # "domestic" | "overseas" | "global"

  sources {
    content  = alicloud_oss_bucket.static.extranet_endpoint
    type     = "oss"
    priority = 20
    port     = 443
    weight   = 10
  }

  # SSL — uses the same cert as the ALB
  ssl_protocol = "on"
  cert_name    = var.alb_ssl_cert_id
  ssl_pub      = ""  # leave blank when referencing cert by ID
  ssl_pri      = ""

  # Force HTTPS
  force_set = "1"
}

# ============================================================
# Cache rules — fine-tuned TTLs per file type
# ============================================================

# Long-lived cache for versioned assets (hashed filenames)
resource "alicloud_dcdn_domain_config" "cache_assets" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "filetype_based_ttl_set"

  function_args {
    arg_name  = "ttl"
    arg_value = "2592000"   # 30 days in seconds
  }
  function_args {
    arg_name  = "file_type"
    arg_value = "js,css,png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot"
  }
  function_args {
    arg_name  = "weight"
    arg_value = "90"
  }
}

# Short cache for HTML — ensures fresh deploys are picked up quickly
resource "alicloud_dcdn_domain_config" "cache_html" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "filetype_based_ttl_set"

  function_args {
    arg_name  = "ttl"
    arg_value = "300"   # 5 minutes
  }
  function_args {
    arg_name  = "file_type"
    arg_value = "html,htm"
  }
  function_args {
    arg_name  = "weight"
    arg_value = "80"
  }
}

# ============================================================
# Force HTTPS redirect at CDN edge
# ============================================================
resource "alicloud_dcdn_domain_config" "https_redirect" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "https_force"

  function_args {
    arg_name  = "enable"
    arg_value = "on"
  }
}

# ============================================================
# HTTP/2 — improves performance for multiplexed asset loading
# ============================================================
resource "alicloud_dcdn_domain_config" "http2" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "http2"

  function_args {
    arg_name  = "enable"
    arg_value = "on"
  }
}

# ============================================================
# CORS headers at CDN edge — avoid round-trip to OSS for CORS
# ============================================================
resource "alicloud_dcdn_domain_config" "cors" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "set_resp_header"

  function_args {
    arg_name  = "key"
    arg_value = "Access-Control-Allow-Origin"
  }
  function_args {
    arg_name  = "value"
    arg_value = "https://${var.domain_name}"
  }
  function_args {
    arg_name  = "description"
    arg_value = "CORS for main app domain"
  }
  function_args {
    arg_name  = "duplicate"
    arg_value = "off"
  }
}

# ============================================================
# Gzip + Brotli compression at edge
# ============================================================
resource "alicloud_dcdn_domain_config" "compress" {
  domain_name   = alicloud_dcdn_domain.static.domain_name
  function_name = "intelligent_compress"

  function_args {
    arg_name  = "enable"
    arg_value = "on"
  }
}

# ============================================================
# Cache purge helper (run manually via CLI after each deploy)
# Usage:  aliyun dcdn RefreshDcdnObjectCaches --ObjectPath "https://static.api.myapp.com/*" --ObjectType "Directory"
# Or use the alicloud_dcdn_domain_config resource with "referer_white_list_set"
# for automated purge — hook into the CI/CD pipeline post-deploy.
# ============================================================

# ============================================================
# WAF protection for DCDN domain (optional but recommended)
# Uncomment once WAF instance is provisioned.
# ============================================================
resource "alicloud_wafv3_defense_resource" "cdn" {
  instance_id   = alicloud_wafv3_instance.main.id
  resource      = alicloud_dcdn_domain.static.domain_name
  resource_type = "cdn"
  address       = "static.${var.domain_name}"
  port          = "443"
  ssl_protocol  = "tls1.2+"
}
