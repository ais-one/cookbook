# ── DB subnet group ───────────────────────────────────────────
resource "aws_db_subnet_group" "pg" {
  name       = "${var.project}-${var.env}-pg-subnet"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "${var.project}-${var.env}-pg-subnet" }
}

# ── Parameter group — PostgreSQL tuning ──────────────────────
resource "aws_db_parameter_group" "pg" {
  name   = "${var.project}-${var.env}-pg15"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }
  parameter {
    name  = "log_disconnections"
    value = "1"
  }
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"   # log queries taking > 1s
  }
}

# ── RDS Instance ──────────────────────────────────────────────
resource "aws_db_instance" "pg" {
  identifier        = "${var.project}-${var.env}-pg"
  engine            = "postgres"
  engine_version    = var.pg_engine_version
  instance_class    = var.pg_instance_class
  allocated_storage = var.pg_storage_gb
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.pg_db_name
  username = var.pg_username
  password = var.pg_password

  db_subnet_group_name   = aws_db_subnet_group.pg.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.pg.name

  # Multi-AZ standby for prod high availability
  multi_az = true

  # Automated backups
  backup_retention_period   = 14
  backup_window             = "02:00-03:00"
  maintenance_window        = "Mon:03:00-Mon:04:00"
  delete_automated_backups  = false

  # Storage autoscaling — grow up to 500 GB
  max_allocated_storage = 500

  # Prevent accidental deletion
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project}-${var.env}-pg-final"

  # Performance Insights
  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [engine_version]
  }

  tags = { Name = "${var.project}-${var.env}-pg" }
}
