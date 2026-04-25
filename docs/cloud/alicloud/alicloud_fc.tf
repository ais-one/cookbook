# ============================================================
# RAM role for Function Compute — allows FC to call other services
# ============================================================
resource "alicloud_ram_role" "fc" {
  name        = "${var.project}-${var.env}-fc-role"
  description = "Execution role for Function Compute functions"

  document = jsonencode({
    Version = "1"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = ["fc.aliyuncs.com"] }
    }]
  })
}

resource "alicloud_ram_role_policy_attachment" "fc_oss" {
  role_name   = alicloud_ram_role.fc.name
  policy_name = "AliyunOSSFullAccess"  # scope this down in production
  policy_type = "System"
}

resource "alicloud_ram_role_policy_attachment" "fc_log" {
  role_name   = alicloud_ram_role.fc.name
  policy_name = "AliyunLogFullAccess"
  policy_type = "System"
}

# ============================================================
# Log project + store for function logs (SLS)
# ============================================================
resource "alicloud_log_project" "fc" {
  project_name = "${var.project}-${var.env}-fc-logs"
  description  = "Function Compute logs"
}

resource "alicloud_log_store" "fc" {
  project_name          = alicloud_log_project.fc.project_name
  logstore_name         = "fc-invocation-logs"
  shard_count           = 2
  auto_split            = true
  max_split_shard_count = 64
  retention_period      = 30
}

# ============================================================
# Function Compute v3 — function definition
# (FC3 replaces the deprecated service/function split of FC2)
# ============================================================
resource "alicloud_fcv3_function" "app" {
  function_name = "${var.project}-${var.env}-handler"
  description   = "Main application handler"
  runtime       = "python3.10"   # options: nodejs18, java11, go1.x, custom, etc.
  handler       = "index.handler"
  memory_size   = 512            # MB
  timeout       = 60             # seconds

  # Container image from ACR — no zip needed
  # Image tag should be pinned (never use "latest" in production)
  custom_container_config {
    image           = "${alicloud_cr_ee_instance.main.id}.cr.aliyuncs.com/${var.acr_namespace}/app-function:1.0.0"
    acceleration_type = "Default"
  }

  # Allow FC to pull from ACR
  instance_lifecycle_config {
    pre_stop {
      handler = "index.preStop"
      timeout = 5
    }
  }

  # Environment variables available inside the function
  environment_variables = {
    DB_HOST     = alicloud_db_instance.pg.connection_string
    DB_PORT     = "5432"
    DB_NAME     = var.pg_db_name
    DB_USER     = var.pg_username
    REDIS_HOST  = alicloud_kvstore_instance.redis.connection_domain
    REDIS_PORT  = "6379"
    OSS_BUCKET  = alicloud_oss_bucket.app.bucket
    ENVIRONMENT = var.env
  }

  # VPC binding — gives the function access to private RDS/Redis
  vpc_config {
    vpc_id             = alicloud_vpc.main.id
    vswitch_ids        = [alicloud_vswitch.private[0].id]
    security_group_id  = alicloud_security_group.app.id
  }

  # NAS config — uncomment if shared file storage is needed
  # nas_config { ... }

  # Log config
  log_config {
    project               = alicloud_log_project.fc.project_name
    logstore              = alicloud_log_store.fc.logstore_name
    enable_instance_metrics = true
    enable_request_metrics  = true
  }

  role = alicloud_ram_role.acr_pull.arn

  # Outgoing internet traffic routes via NAT gateway SNAT rule
  # (no extra config needed — VPC + SNAT handles it automatically)
}

# ============================================================
# HTTP trigger — exposes the function as an HTTP endpoint
# ============================================================
resource "alicloud_fcv3_trigger" "http" {
  function_name = alicloud_fcv3_function.app.function_name
  trigger_name  = "http-trigger"
  trigger_type  = "http"

  trigger_config = jsonencode({
    authType = "anonymous"  # change to "jwt" or "function" for auth
    methods  = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
}

# ============================================================
# OSS trigger — invoke function when objects are uploaded
# (useful for image processing, ETL, etc.)
# ============================================================
resource "alicloud_fcv3_trigger" "oss_upload" {
  function_name = alicloud_fcv3_function.app.function_name
  trigger_name  = "oss-upload-trigger"
  trigger_type  = "oss"
  source_arn    = "acs:oss:${var.region}:*:${alicloud_oss_bucket.app.bucket}"

  trigger_config = jsonencode({
    events = ["oss:ObjectCreated:*"]
    filter = {
      key = {
        prefix = "uploads/"
        suffix = ""
      }
    }
  })
}

# ============================================================
# Concurrency & scaling (optional but recommended for prod)
# ============================================================
resource "alicloud_fcv3_concurrency_config" "app" {
  function_name             = alicloud_fcv3_function.app.function_name
  reserved_concurrency      = 10   # always-warm instances
}
