# ============================================================
# RDS PostgreSQL instance
# ============================================================
resource "alicloud_db_instance" "pg" {
  engine               = "PostgreSQL"
  engine_version       = var.pg_engine_version
  instance_type        = var.pg_instance_type
  instance_storage     = var.pg_storage_gb
  instance_charge_type = "Postpaid"
  instance_name        = "${var.project}-${var.env}-pg"

  # Deploy into first private vSwitch; add secondary_zone_id for HA
  vswitch_id        = alicloud_vswitch.private[0].id
  security_group_id = alicloud_security_group.rds.id
  zone_id           = var.availability_zones[0]

  # High-availability — uncomment for prod multi-AZ standby
  # secondary_zone_id = var.availability_zones[1]

  # Storage auto-expansion: grow up to 500 GB in 5 GB increments
  db_instance_storage_type = "cloud_essd"
  storage_auto_scale       = "Enable"
  storage_threshold        = 20  # trigger at 20% free
  storage_upper_bound      = 500

  # Encryption at rest
  encryption = true

  # Maintenance window (UTC) — choose off-peak for your region
  maintain_time = "02:00Z-03:00Z"

  lifecycle {
    prevent_destroy = true
    # Ignore engine version changes to avoid accidental major upgrades
    ignore_changes = [engine_version]
  }
}

# ============================================================
# Database and account
# ============================================================
resource "alicloud_db_database" "app" {
  instance_id   = alicloud_db_instance.pg.id
  name          = var.pg_db_name
  character_set = "UTF8"
  description   = "${var.project} ${var.env} application database"
}

resource "alicloud_rds_account" "app" {
  db_instance_id   = alicloud_db_instance.pg.id
  account_name     = var.pg_username
  account_password = var.pg_password
  account_type     = "Super"
}

resource "alicloud_db_account_privilege" "app" {
  instance_id  = alicloud_db_instance.pg.id
  account_name = alicloud_rds_account.app.account_name
  privilege    = "DBOwner"
  db_names     = [alicloud_db_database.app.name]
}

# ============================================================
# Automated backups
# ============================================================
resource "alicloud_db_backup_policy" "pg" {
  instance_id         = alicloud_db_instance.pg.id
  backup_period       = ["Monday", "Wednesday", "Friday", "Sunday"]
  backup_time         = "02:00Z-03:00Z"
  retention_period    = 14   # days
  log_backup_enabled  = true
  log_retention_period = 7
}
