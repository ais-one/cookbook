variable "cloudflare_api_token" {
  description = "Cloudflare API token — inject via CLOUDFLARE_API_TOKEN env var or TF_VAR_cloudflare_api_token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (visible in the dashboard URL)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for your domain (visible in the Zone Overview page)"
  type        = string
}

variable "project" {
  type    = string
  default = "myapp"
}

variable "env" {
  type    = string
  default = "prod"
}

# ── Domains ──────────────────────────────────────────────────
variable "root_domain" {
  description = "Apex domain managed in Cloudflare (e.g. myapp.com)"
  type        = string
  default     = "myapp.com"
}

variable "api_subdomain" {
  description = "Subdomain for the ALB API endpoint"
  type        = string
  default     = "api"  # → api.myapp.com
}

variable "static_subdomain" {
  description = "Subdomain for the static site origin"
  type        = string
  default     = "static"  # → static.myapp.com
}

# ── Origins ───────────────────────────────────────────────────
# These come from terraform output of your cloud stack.
# For AWS:    alb_dns_name, s3_static_bucket regional domain
# For AliCloud: alb dns name, oss extranet endpoint

variable "alb_origin_hostname" {
  description = "DNS hostname of the ALB (from terraform output alb_dns_name / alb_public_dns)"
  type        = string
  # AWS example:    "myapp-prod-alb-1234567890.ap-southeast-1.elb.amazonaws.com"
  # AliCloud example: "myapp-prod-alb-1234567890.ap-southeast-1.alb.aliyuncs.com"
}

variable "static_origin_hostname" {
  description = "Origin hostname for the static bucket"
  type        = string
  # AWS example:    "my-org-static-site.s3.ap-southeast-1.amazonaws.com"
  # AliCloud example: "my-org-static-site.oss-ap-southeast-1.aliyuncs.com"
}

# ── WAF ───────────────────────────────────────────────────────
variable "admin_cidr" {
  description = "CIDR allowed to reach /admin paths"
  type        = string
  default     = "203.0.113.0/24"
}

variable "waf_rate_limit_rps" {
  description = "Max requests per second per IP before rate-limit rule triggers"
  type        = number
  default     = 100
}

# ── Cache ─────────────────────────────────────────────────────
variable "html_cache_ttl" {
  description = "Browser cache TTL for HTML files (seconds)"
  type        = number
  default     = 300
}

variable "asset_cache_ttl" {
  description = "Browser cache TTL for hashed assets (seconds)"
  type        = number
  default     = 2592000  # 30 days
}
