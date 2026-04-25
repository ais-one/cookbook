# ── Subnet group ─────────────────────────────────────────────
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project}-${var.env}-redis-subnet"
  subnet_ids = aws_subnet.private[*].id
}

# ── Parameter group ───────────────────────────────────────────
resource "aws_elasticache_parameter_group" "redis" {
  name   = "${var.project}-${var.env}-redis7"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"   # evict least-recently-used keys when full
  }
}

# ── Replication group (cluster with TLS + auth token) ────────
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "${var.project}-${var.env}-redis"
  description          = "${var.project} ${var.env} Redis"

  node_type            = var.redis_node_type
  engine_version       = var.redis_engine_version
  parameter_group_name = aws_elasticache_parameter_group.redis.name
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  # One primary + one replica across AZs
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled           = true

  # Encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  # Backups
  snapshot_retention_limit = 7
  snapshot_window          = "03:00-04:00"
  maintenance_window       = "mon:04:00-mon:05:00"

  apply_immediately = false

  lifecycle { prevent_destroy = true }

  tags = { Name = "${var.project}-${var.env}-redis" }
}
