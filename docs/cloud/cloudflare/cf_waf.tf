# ── WAF Custom Ruleset ────────────────────────────────────────
resource "cloudflare_ruleset" "waf_custom" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-waf-custom"
  description = "Custom WAF rules — rate limiting, bot signals, admin allowlist"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  # Rule 1 — IP allowlist for /admin (block everyone else)
  # MUST be first (lowest priority number = evaluated first)
  rules {
    description = "Block /admin access from non-allowlisted IPs"
    enabled     = true
    expression  = <<-EOT
      (http.request.uri.path starts_with "/admin") and
      (not ip.src in {${var.admin_cidr}})
    EOT
    action      = "block"

    action_parameters {
      response {
        status_code  = 403
        content_type = "application/json"
        content      = "{\"error\":\"Forbidden\",\"message\":\"Access to admin is restricted.\"}"
      }
    }
  }

  # Rule 2 — Block requests with no User-Agent
  rules {
    description = "Block requests missing User-Agent header"
    enabled     = true
    expression  = "(not http.request.headers[\"user-agent\"][0] exists)"
    action      = "block"
  }

  # Rule 3 — Challenge known bad bots (Cloudflare managed bot score)
  # bot_score < 30 = high confidence it's a bot
  rules {
    description = "Challenge high-confidence bots"
    enabled     = true
    expression  = "(cf.bot_management.score lt 30 and not cf.bot_management.verified_bot)"
    action      = "managed_challenge"
  }

  # Rule 4 — Block requests from anonymizing proxies (Tor, VPN, etc.)
  # Remove this rule if your users are expected to use VPNs
  rules {
    description = "Block Tor and anonymizing proxies"
    enabled     = true
    expression  = "(cf.threat_score gt 50)"
    action      = "block"
  }

  # Rule 5 — Block nulled/empty referer on API (CSRF signal)
  rules {
    description = "Challenge cross-origin POST/PUT/DELETE with no Referer"
    enabled     = true
    expression  = <<-EOT
      (http.host eq "${var.api_subdomain}.${var.root_domain}") and
      (http.request.method in {"POST" "PUT" "DELETE" "PATCH"}) and
      (not http.request.headers["referer"][0] exists)
    EOT
    action = "managed_challenge"
  }
}

# ── Rate limiting ruleset ─────────────────────────────────────
resource "cloudflare_ruleset" "rate_limit" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-rate-limit"
  description = "Rate limiting rules"
  kind        = "zone"
  phase       = "http_ratelimit"

  # Limit per IP across the whole zone
  rules {
    description = "Global rate limit — ${var.waf_rate_limit_rps} req/s per IP"
    enabled     = true
    expression  = "(true)"

    action = "block"
    action_parameters {
      response {
        status_code  = 429
        content_type = "application/json"
        content      = "{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please slow down.\"}"
      }
    }

    ratelimit {
      characteristics      = ["cf.colo.id", "ip.src"]
      period               = 10      # seconds
      requests_per_period  = var.waf_rate_limit_rps * 10   # rps × period
      mitigation_timeout   = 60      # block for 60s after trigger
    }
  }

  # Stricter limit on login/auth endpoints
  rules {
    description = "Strict rate limit on auth endpoints"
    enabled     = true
    expression  = "(http.request.uri.path starts_with \"/auth\" or http.request.uri.path starts_with \"/login\")"

    action = "block"
    action_parameters {
      response {
        status_code  = 429
        content_type = "application/json"
        content      = "{\"error\":\"Too Many Requests\",\"message\":\"Too many auth attempts.\"}"
      }
    }

    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60     # 1 minute window
      requests_per_period = 10     # 10 login attempts per minute per IP
      mitigation_timeout  = 300    # block for 5 minutes
    }
  }
}

# ── Managed WAF ruleset (Cloudflare-maintained OWASP rules) ───
# Requires Cloudflare Pro plan or above.
resource "cloudflare_ruleset" "waf_managed" {
  zone_id     = var.cloudflare_zone_id
  name        = "${var.project}-${var.env}-managed-waf"
  description = "Cloudflare Managed Ruleset (OWASP, CVE patches)"
  kind        = "zone"
  phase       = "http_request_firewall_managed"

  # Cloudflare Managed Rules
  rules {
    description = "Cloudflare Managed Ruleset"
    enabled     = true
    expression  = "(true)"
    action      = "execute"

    action_parameters {
      id      = "efb7b8c949ac4650a09736fc376e9aee"   # Cloudflare Managed Rules
      version = "latest"

      overrides {
        # Set default action to "log" first during roll-out, then switch to "block"
        action = "block"

        # Suppress false positives for your API — add rule IDs as needed
        # rules {
        #   id      = "..."
        #   enabled = false
        # }
      }
    }
  }

  # OWASP Core Rule Set
  rules {
    description = "Cloudflare OWASP Core Rule Set"
    enabled     = true
    expression  = "(true)"
    action      = "execute"

    action_parameters {
      id      = "4814384a9e5d4991b9815dcfc25d2f1f"   # Cloudflare OWASP CRS
      version = "latest"

      overrides {
        action = "block"

        categories {
          category = "paranoia-level-2"
          enabled  = true
          action   = "block"
        }
      }
    }
  }
}
