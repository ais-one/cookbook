# ── Cache rules (Cloudflare Cache Rules — v2 replacement for Page Rules) ──

# 1. Bypass cache for API subdomain — never cache API responses at edge
resource "cloudflare_ruleset" "cache_api" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-api-cache"
  description = "Bypass Cloudflare cache for all API requests"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules {
    description = "Bypass cache for api subdomain"
    enabled     = true
    expression  = "(http.host eq \"${var.api_subdomain}.${var.root_domain}\")"

    action = "set_cache_settings"
    action_parameters {
      cache = false
    }
  }
}

# 2. Static site cache rules — different TTLs per file type
resource "cloudflare_ruleset" "cache_static" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-static-cache"
  description = "Cache rules for static site assets"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  # Rule A — Long TTL for hashed/versioned assets
  rules {
    description = "Long cache for versioned assets (JS, CSS, fonts, images)"
    enabled     = true
    expression  = <<-EOT
      (http.host eq "${var.static_subdomain}.${var.root_domain}") and
      (
        http.request.uri.path.extension in {"js" "css" "woff" "woff2" "ttf" "eot" "svg" "ico" "png" "jpg" "jpeg" "gif" "webp" "avif"}
      )
    EOT

    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = var.asset_cache_ttl
      }
      browser_ttl {
        mode    = "override_origin"
        default = var.asset_cache_ttl
      }
      serve_stale {
        disable_stale_while_updating = false
      }
    }
  }

  # Rule B — Short TTL for HTML (ensures fresh deploys surface quickly)
  rules {
    description = "Short cache for HTML files"
    enabled     = true
    expression  = <<-EOT
      (http.host eq "${var.static_subdomain}.${var.root_domain}") and
      (http.request.uri.path.extension in {"html" "htm"} or
       http.request.uri.path eq "/")
    EOT

    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = var.html_cache_ttl
      }
      browser_ttl {
        mode    = "override_origin"
        default = var.html_cache_ttl
      }
    }
  }
}

# ── Transform rule — add security + CORS response headers ─────
resource "cloudflare_ruleset" "response_headers" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-response-headers"
  description = "Inject security and CORS headers on all responses"
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    description = "Security headers for static site"
    enabled     = true
    expression  = "(http.host eq \"${var.static_subdomain}.${var.root_domain}\")"

    action = "rewrite"
    action_parameters {
      headers {
        name      = "X-Content-Type-Options"
        operation = "set"
        value     = "nosniff"
      }
      headers {
        name      = "X-Frame-Options"
        operation = "set"
        value     = "DENY"
      }
      headers {
        name      = "Referrer-Policy"
        operation = "set"
        value     = "strict-origin-when-cross-origin"
      }
      headers {
        name      = "Permissions-Policy"
        operation = "set"
        value     = "geolocation=(), microphone=(), camera=()"
      }
      headers {
        name      = "Access-Control-Allow-Origin"
        operation = "set"
        value     = "https://${var.api_subdomain}.${var.root_domain}"
      }
    }
  }
}

# ── Redirect rule — apex → www ────────────────────────────────
resource "cloudflare_ruleset" "redirect_apex" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-redirects"
  description = "Redirect apex domain to static subdomain"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    description = "Redirect myapp.com → static.myapp.com"
    enabled     = true
    expression  = "(http.host eq \"${var.root_domain}\")"

    action = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          value = "https://${var.static_subdomain}.${var.root_domain}"
        }
        preserve_query_string = true
      }
    }
  }
}
