variable "region" {
  description = "AliCloud region"
  type        = string
  default     = "ap-southeast-1"
}

variable "project" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "myapp"
}

variable "env" {
  description = "Environment (prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "Private vSwitch CIDRs (one per zone)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets" {
  description = "Public vSwitch CIDRs (for NAT gateway)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "availability_zones" {
  description = "AZs to deploy into (must match region)"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"]
}

# OSS
variable "oss_bucket_name" {
  description = "OSS bucket name for app assets (globally unique)"
  type        = string
  default     = "my-org-app-assets"
}

variable "oss_static_bucket_name" {
  description = "OSS bucket name for static HTML hosting (globally unique)"
  type        = string
  default     = "my-org-static-site"
}

# ACR
variable "acr_namespace" {
  description = "ACR namespace for container images"
  type        = string
  default     = "my-org-containers"
}

variable "acr_repos" {
  description = "List of ACR repository names to create"
  type        = list(string)
  default     = ["app-function", "app-sae"]
}

# ALB + Custom Domain
variable "alb_name" {
  description = "Name for the Application Load Balancer"
  type        = string
  default     = "myapp-prod-alb"
}

variable "domain_name" {
  description = "Root custom domain (e.g. api.myapp.com). CDN will use static.<domain_name>"
  type        = string
  default     = "api.myapp.com"
}

variable "alb_ssl_cert_id" {
  description = "SSL certificate ID from AliCloud SSL Certificates Service (used by ALB and DCDN)"
  type        = string
  # Find at: https://yundun.console.aliyun.com → SSL Certificates
}

# WAF
variable "waf_edition" {
  description = "WAF edition: BasicEdition | ProEdition | EnterpriseEdition"
  type        = string
  default     = "ProEdition"
}

variable "admin_cidr" {
  description = "CIDR allowed to access /admin paths (your office/VPN IP)"
  type        = string
  default     = "203.0.113.0/24"
}

# CDN
variable "cdn_scope" {
  description = "DCDN acceleration scope: domestic | overseas | global"
  type        = string
  default     = "overseas"
}

  description = "SAE namespace name"
  type        = string
  default     = "myapp-prod"
}

variable "sae_app_name" {
  description = "SAE application name"
  type        = string
  default     = "myapp-api"
}

variable "sae_replicas" {
  description = "Number of SAE application instances"
  type        = number
  default     = 2
}

variable "sae_cpu" {
  description = "CPU per SAE instance (millicores)"
  type        = number
  default     = 500
}

variable "sae_memory" {
  description = "Memory per SAE instance (MB)"
  type        = number
  default     = 1024
}

# RDS PostgreSQL
variable "pg_instance_type" {
  type    = string
  default = "pg.n2.medium.2c"
}

variable "pg_engine_version" {
  type    = string
  default = "15.0"
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
  description = "RDS master username"
  type        = string
  default     = "appuser"
  sensitive   = true
}

variable "pg_password" {
  description = "RDS master password — inject via TF_VAR_pg_password env var"
  type        = string
  sensitive   = true
}

# Redis
variable "redis_instance_type" {
  type    = string
  default = "redis.master.micro.default" # single-node; use redis.shard.* for cluster
}

variable "redis_engine_version" {
  type    = string
  default = "7.0"
}

variable "redis_password" {
  description = "Redis auth password — inject via TF_VAR_redis_password env var"
  type        = string
  sensitive   = true
}

# Function Compute
variable "fc_service_name" {
  type    = string
  default = "myapp-functions"
}
