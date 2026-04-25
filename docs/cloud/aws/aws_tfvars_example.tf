# ============================================================
# Copy to terraform.tfvars and fill in values.
# Add terraform.tfvars to .gitignore — never commit it.
# Inject secrets via environment variables:
#   export TF_VAR_pg_password="..."
#   export TF_VAR_redis_auth_token="..."
# ============================================================

# ── General ─────────────────────────────────────────────────
region  = "ap-southeast-1"   # ap-southeast-1 (Singapore), us-east-1, eu-west-1, etc.
project = "myapp"
env     = "prod"

# ── Networking ───────────────────────────────────────────────
vpc_cidr           = "10.0.0.0/16"
public_subnets     = ["10.0.101.0/24", "10.0.102.0/24"]
private_subnets    = ["10.0.1.0/24",   "10.0.2.0/24"]
availability_zones = ["ap-southeast-1a", "ap-southeast-1b"]

# ── S3 ───────────────────────────────────────────────────────
s3_app_bucket    = "myapp-prod-assets"      # private
s3_static_bucket = "myapp-prod-static"      # served via CloudFront

# ── ECR ──────────────────────────────────────────────────────
ecr_repos = ["app-lambda", "app-ecs"]

# ── RDS PostgreSQL ───────────────────────────────────────────
pg_instance_class = "db.t3.medium"   # db.t3.medium / db.r6g.large for prod
pg_engine_version = "15.5"
pg_storage_gb     = 50
pg_db_name        = "appdb"
pg_username       = "appuser"
# pg_password      → inject via TF_VAR_pg_password

# ── ElastiCache Redis ────────────────────────────────────────
redis_node_type      = "cache.t3.micro"   # cache.r6g.large for prod
redis_engine_version = "7.1"
# redis_auth_token  → inject via TF_VAR_redis_auth_token

# ── ECS Fargate ──────────────────────────────────────────────
ecs_app_name = "myapp-api"
ecs_cpu      = 512     # 0.5 vCPU (256 | 512 | 1024 | 2048 | 4096)
ecs_memory   = 1024    # MB — must be valid for chosen cpu
ecs_replicas = 2

# ── ALB + Domain ─────────────────────────────────────────────
domain_name  = "api.myapp.com"
# ACM cert must cover api.myapp.com AND static.api.myapp.com
# Use a wildcard: *.myapp.com
# Create: aws acm request-certificate --domain-name "*.myapp.com" --validation-method DNS --region ap-southeast-1
# For CloudFront WAF the cert must ALSO exist in us-east-1:
# aws acm request-certificate --domain-name "*.myapp.com" --validation-method DNS --region us-east-1
acm_cert_arn = "arn:aws:acm:ap-southeast-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# ── WAF ──────────────────────────────────────────────────────
admin_cidr     = "203.0.113.0/24"   # your office/VPN CIDR for /admin allowlist
waf_rate_limit = 2000               # max requests per 5-min window per IP
