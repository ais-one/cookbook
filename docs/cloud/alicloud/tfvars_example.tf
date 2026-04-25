# ============================================================
# Copy this file to terraform.tfvars and fill in your values.
# Never commit terraform.tfvars to source control — add it to .gitignore.
# Sensitive values (passwords) should be injected via environment variables:
#   export TF_VAR_pg_password="..."
#   export TF_VAR_redis_password="..."
# ============================================================

# ── General ─────────────────────────────────────────────────
region  = "ap-southeast-1"   # Singapore. Other options: cn-hangzhou, cn-shanghai, ap-southeast-3
project = "myapp"
env     = "prod"

# ── Networking ───────────────────────────────────────────────
vpc_cidr           = "10.0.0.0/16"
public_subnets     = ["10.0.101.0/24", "10.0.102.0/24"]
private_subnets    = ["10.0.1.0/24",   "10.0.2.0/24"]
availability_zones = ["ap-southeast-1a", "ap-southeast-1b"]

# ── OSS ──────────────────────────────────────────────────────
oss_bucket_name        = "myapp-prod-assets"          # private app assets
oss_static_bucket_name = "myapp-prod-static"          # public static site

# ── ACR ──────────────────────────────────────────────────────
acr_namespace = "myapp-containers"
acr_repos     = ["app-function", "app-sae"]

# ── RDS PostgreSQL ───────────────────────────────────────────
pg_instance_type  = "pg.n2.medium.2c"   # 2 vCPU, 4 GB RAM
pg_engine_version = "15.0"
pg_storage_gb     = 50
pg_db_name        = "appdb"
pg_username       = "appuser"
# pg_password     = inject via TF_VAR_pg_password

# ── Redis ────────────────────────────────────────────────────
redis_instance_type  = "redis.master.micro.default"  # single-node dev/staging
# redis.shard.small.8 — cluster mode for prod high availability
redis_engine_version = "7.0"
# redis_password   = inject via TF_VAR_redis_password

# ── Function Compute ─────────────────────────────────────────
fc_service_name = "myapp-prod-functions"

# ── Serverless App Engine ────────────────────────────────────
sae_namespace_name = "myapp-prod"
sae_app_name       = "myapp-api"
sae_replicas       = 2
sae_cpu            = 500    # millicores — 500 = 0.5 vCPU
sae_memory         = 1024   # MB

# ── ALB + Custom Domain ──────────────────────────────────────
alb_name           = "myapp-prod-alb"
domain_name        = "api.myapp.com"          # ALB = api.myapp.com, CDN = static.api.myapp.com
# Certificate must be uploaded to AliCloud SSL Certificates Service first.
# Used by both ALB (HTTPS termination) and DCDN (static site SSL).
# Find the ID at: https://yundun.console.aliyun.com → SSL Certificates
alb_ssl_cert_id    = "cas-cn-xxxxxxxx"

# ── WAF ──────────────────────────────────────────────────────
waf_edition  = "ProEdition"       # BasicEdition | ProEdition | EnterpriseEdition
admin_cidr   = "203.0.113.0/24"  # your office or VPN CIDR for /admin allowlist

# ── CDN (DCDN) ───────────────────────────────────────────────
# static site will be served at: static.api.myapp.com
cdn_scope    = "overseas"   # domestic | overseas | global
