# ── General ─────────────────────────────────────────────────
variable "region" {
  type    = string
  default = "ap-southeast-1"
}

variable "project" {
  type    = string
  default = "myapp"
}

variable "env" {
  type    = string
  default = "prod"
}

# ── Networking ───────────────────────────────────────────────
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnets" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "private_subnets" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-southeast-1a", "ap-southeast-1b"]
}

# ── S3 ───────────────────────────────────────────────────────
variable "s3_app_bucket" {
  description = "Private S3 bucket for app assets"
  type        = string
  default     = "my-org-app-assets"
}

variable "s3_static_bucket" {
  description = "S3 bucket for static website hosting"
  type        = string
  default     = "my-org-static-site"
}

# ── ECR ──────────────────────────────────────────────────────
variable "ecr_repos" {
  description = "ECR repository names"
  type        = list(string)
  default     = ["app-lambda", "app-ecs"]
}

# ── RDS PostgreSQL ───────────────────────────────────────────
variable "pg_instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "pg_engine_version" {
  type    = string
  default = "15.5"
}

variable "pg_storage_gb" {
  type    = number
  default = 50
}

variable "pg_db_name" {
  type    = string
  default = "appdb"
}

variable "pg_username" {
  type      = string
  default   = "appuser"
  sensitive = true
}

variable "pg_password" {
  type      = string
  sensitive = true
}

# ── ElastiCache Redis ────────────────────────────────────────
variable "redis_node_type" {
  type    = string
  default = "cache.t3.micro"
}

variable "redis_engine_version" {
  type    = string
  default = "7.1"
}

variable "redis_auth_token" {
  type      = string
  sensitive = true
}

# ── ECS (Fargate) — equiv of SAE ────────────────────────────
variable "ecs_app_name" {
  type    = string
  default = "myapp-api"
}

variable "ecs_cpu" {
  type    = number
  default = 512  # 0.5 vCPU
}

variable "ecs_memory" {
  type    = number
  default = 1024 # MB
}

variable "ecs_replicas" {
  type    = number
  default = 2
}

# ── ALB + Domain + SSL ───────────────────────────────────────
variable "domain_name" {
  description = "Root domain (e.g. api.myapp.com)"
  type        = string
  default     = "api.myapp.com"
}

variable "acm_cert_arn" {
  description = "ACM certificate ARN for ALB HTTPS and CloudFront"
  type        = string
  # Create via: aws acm request-certificate --domain-name "*.myapp.com" --validation-method DNS
}

# ── WAF ──────────────────────────────────────────────────────
variable "admin_cidr" {
  description = "CIDR allowed to reach /admin paths"
  type        = string
  default     = "203.0.113.0/24"
}

variable "waf_rate_limit" {
  description = "Max requests per 5-minute window per IP before blocking"
  type        = number
  default     = 2000
}
