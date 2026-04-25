# ============================================================
# SAE Namespace — logical isolation boundary for SAE apps
# Must be in the same region; namespace ID format: region:name
# ============================================================
resource "alicloud_sae_namespace" "main" {
  namespace_id          = "${var.region}:${var.sae_namespace_name}"
  namespace_name        = var.sae_namespace_name
  namespace_description = "${var.project} ${var.env} SAE namespace"
}

# ============================================================
# SAE Application — runs your container from ACR
# ============================================================
resource "alicloud_sae_application" "app" {
  app_name        = var.sae_app_name
  namespace_id    = alicloud_sae_namespace.main.id
  app_description = "${var.project} ${var.env} API application"

  # Container image from ACR
  # Pin to a specific digest or tag — never use "latest" in prod
  image_url = "${alicloud_cr_ee_instance.main.id}.cr.aliyuncs.com/${var.acr_namespace}/app-sae:1.0.0"

  # Compute
  replicas    = var.sae_replicas
  cpu         = var.sae_cpu    # millicores (500 = 0.5 vCPU)
  memory      = var.sae_memory # MB

  # VPC binding — gives app access to private RDS/Redis
  vpc_id     = alicloud_vpc.main.id
  vswitch_id = alicloud_vswitch.private[0].id

  # Application port
  package_type = "Image"

  # Environment variables
  envs = jsonencode([
    { name = "DB_HOST",    value = alicloud_db_instance.pg.connection_string },
    { name = "DB_PORT",    value = "5432" },
    { name = "DB_NAME",    value = var.pg_db_name },
    { name = "DB_USER",    value = var.pg_username },
    { name = "REDIS_HOST", value = alicloud_kvstore_instance.redis.connection_domain },
    { name = "REDIS_PORT", value = "6379" },
    { name = "OSS_BUCKET", value = alicloud_oss_bucket.app.bucket },
    { name = "ENVIRONMENT", value = var.env },
  ])

  # Liveness probe — restart the container if it becomes unhealthy
  liveness = jsonencode({
    httpGet = {
      path = "/health"
      port = 8080
    }
    initialDelaySeconds = 10
    periodSeconds       = 5
    timeoutSeconds      = 3
    failureThreshold    = 3
  })

  # Readiness probe — only route traffic when ready
  readiness = jsonencode({
    httpGet = {
      path = "/ready"
      port = 8080
    }
    initialDelaySeconds = 10
    periodSeconds       = 5
    timeoutSeconds      = 3
    failureThreshold    = 3
  })

  # Graceful shutdown
  termination_grace_period_seconds = 30

  # ACR pull credentials — references the pull role
  image_pull_secrets = alicloud_ram_role.acr_pull.arn

  lifecycle {
    # Ignore image tag changes — deployments update this via CI/CD,
    # not Terraform, to avoid accidental rollbacks
    ignore_changes = [image_url]
  }
}

# ============================================================
# SAE auto-scaling — scale out under load, in during quiet hours
# ============================================================
resource "alicloud_sae_application_scaling_rule" "cpu" {
  app_id             = alicloud_sae_application.app.id
  scaling_rule_name  = "cpu-scaling"
  scaling_rule_type  = "mix" # combines metric + scheduled scaling

  scaling_rule_metric {
    max_replicas = 10
    min_replicas = var.sae_replicas

    metrics {
      metric_type              = "CPU"
      metric_target_average_utilization = 70
    }

    scale_up_rules {
      step                         = 2   # add 2 instances at a time
      disabled                     = false
      stabilization_window_seconds = 60
    }

    scale_down_rules {
      step                         = 1
      disabled                     = false
      stabilization_window_seconds = 300 # wait 5 min before scaling in
    }
  }
}

# ============================================================
# SAE Ingress (ALB-based) — public HTTPS endpoint
# ============================================================
resource "alicloud_sae_ingress" "app" {
  slb_type     = "internet"  # use "intranet" for internal-only
  namespace_id = alicloud_sae_namespace.main.id
  listener_port = 443

  rules {
    app_id       = alicloud_sae_application.app.id
    app_name     = alicloud_sae_application.app.app_name
    container_port = 8080
    domain       = "${var.project}.example.com"  # replace with your domain
    path         = "/"
  }

  default_rule {
    app_id         = alicloud_sae_application.app.id
    container_port = 8080
  }
}
