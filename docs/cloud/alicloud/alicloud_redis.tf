# ============================================================
# Redis instance
# ============================================================
resource "alicloud_kvstore_instance" "redis" {
  db_instance_name  = "${var.project}-${var.env}-redis"
  instance_class    = var.redis_instance_type
  engine_version    = var.redis_engine_version
  instance_type     = "Redis"
  charge_type       = "PostPaid"

  vswitch_id        = alicloud_vswitch.private[0].id
  zone_id           = var.availability_zones[0]
  security_group_id = alicloud_security_group.redis.id

  # Auth — strong password required
  password = var.redis_password

  # Enable TLS in transit
  ssl_enable = "Enable"

  # Maintenance window (UTC)
  maintain_start_time = "02:00Z"
  maintain_end_time   = "03:00Z"

  lifecycle {
    prevent_destroy = true
  }
}

# ============================================================
# Backup policy
# ============================================================
resource "alicloud_kvstore_backup_policy" "redis" {
  instance_id   = alicloud_kvstore_instance.redis.id
  backup_period = ["Monday", "Wednesday", "Friday", "Sunday"]
  backup_time   = "03:00Z-04:00Z"
}
