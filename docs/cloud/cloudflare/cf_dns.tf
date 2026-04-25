# ── API subdomain → ALB ───────────────────────────────────────
# proxied = true routes traffic through Cloudflare (CDN + WAF active)
# proxied = false is a plain DNS passthrough — don't use for public endpoints
resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = var.api_subdomain         # "api" → api.myapp.com
  type    = "CNAME"
  value   = var.alb_origin_hostname
  proxied = true                      # traffic flows through Cloudflare
  ttl     = 1                         # 1 = "Auto" when proxied = true
  comment = "Managed by Terraform — ${var.project} ${var.env} ALB"
}

# ── Static site subdomain → S3 / OSS bucket ──────────────────
resource "cloudflare_record" "static" {
  zone_id = var.cloudflare_zone_id
  name    = var.static_subdomain      # "static" → static.myapp.com
  type    = "CNAME"
  value   = var.static_origin_hostname
  proxied = true
  ttl     = 1
  comment = "Managed by Terraform — ${var.project} ${var.env} static site"
}

# ── Apex domain → API (optional: redirect root to www or api) ─
resource "cloudflare_record" "apex_redirect" {
  zone_id = var.cloudflare_zone_id
  name    = "@"                       # apex (myapp.com)
  type    = "A"
  value   = "192.0.2.1"              # dummy IP — Cloudflare uses the redirect rule below
  proxied = true
  ttl     = 1
  comment = "Apex placeholder — traffic handled by redirect rule"
}
