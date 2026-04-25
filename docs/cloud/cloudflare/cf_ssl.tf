# ── TLS mode ─────────────────────────────────────────────────
# "strict" = Cloudflare ↔ origin uses valid HTTPS (recommended)
# "full"   = Cloudflare ↔ origin uses HTTPS but allows self-signed certs
# "flexible" = Cloudflare ↔ origin is plain HTTP (NOT recommended)
resource "cloudflare_zone_settings_override" "main" {
  zone_id = var.cloudflare_zone_id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    automatic_https_rewrites = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "zrt"    # TLS 1.3 + 0-RTT
    http2                    = "on"
    http3                    = "on"
    early_hints              = "on"     # preload hints for faster page loads
    brotli                   = "on"
    rocket_loader            = "off"    # keep off unless you've tested it with your SPA
    development_mode         = "off"

    # Security headers
    security_header {
      enabled            = true
      preload            = true
      max_age            = 31536000
      include_subdomains = true
      nosniff            = true
    }
  }
}

# ── Managed certificate (Cloudflare issues this for free) ─────
# Cloudflare automatically provisions a TLS cert for proxied records.
# This resource controls advanced cert settings.
resource "cloudflare_certificate_pack" "main" {
  zone_id              = var.cloudflare_zone_id
  type                 = "advanced"
  hosts                = [
    var.root_domain,
    "*.${var.root_domain}",
  ]
  validation_method    = "txt"
  validity_days        = 90
  certificate_authority = "lets_encrypt"
  cloudflare_branding  = false
  wait_for_active_status = true
}
