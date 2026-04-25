# ============================================================
# Copy to terraform.tfvars — never commit it.
# Inject secrets via environment variables:
#   export TF_VAR_cloudflare_api_token="..."
# ============================================================

# ── Cloudflare identity ──────────────────────────────────────
# cloudflare_api_token → inject via TF_VAR_cloudflare_api_token

# Account ID: visible in the Cloudflare dashboard URL
# https://dash.cloudflare.com/<account_id>/...
cloudflare_account_id = "abcdef1234567890abcdef1234567890"

# Zone ID: visible on the Zone Overview page (right sidebar)
cloudflare_zone_id    = "1234567890abcdef1234567890abcdef"

# ── Project ──────────────────────────────────────────────────
project = "myapp"
env     = "prod"

# ── Domains ──────────────────────────────────────────────────
root_domain      = "myapp.com"
api_subdomain    = "api"      # → api.myapp.com     (proxied → ALB)
static_subdomain = "static"   # → static.myapp.com  (proxied → S3/OSS)

# ── Origins — paste from terraform output of your cloud stack ─
# AWS:
#   alb_origin_hostname    = terraform output -raw alb_dns_name
#   static_origin_hostname = terraform output -raw s3_static_bucket + ".s3.ap-southeast-1.amazonaws.com"
# AliCloud:
#   alb_origin_hostname    = ALB DNS from AliCloud console
#   static_origin_hostname = terraform output -raw oss_static_website_endpoint (without https://)

alb_origin_hostname    = "myapp-prod-alb-1234567890.ap-southeast-1.elb.amazonaws.com"
static_origin_hostname = "my-org-static-site.s3.ap-southeast-1.amazonaws.com"

# ── WAF ──────────────────────────────────────────────────────
admin_cidr         = "203.0.113.0/24"   # your office/VPN CIDR for /admin
waf_rate_limit_rps = 100                # requests per second per IP

# ── Cache TTLs ───────────────────────────────────────────────
html_cache_ttl  = 300       # 5 minutes — HTML refreshes quickly after deploy
asset_cache_ttl = 2592000   # 30 days  — hashed filenames make this safe
