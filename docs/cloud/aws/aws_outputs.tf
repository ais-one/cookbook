output "nat_public_ip" {
  description = "Static outgoing public IP via NAT gateway"
  value       = aws_eip.nat.public_ip
}

output "alb_dns_name" {
  description = "ALB DNS name — create a CNAME/A alias record pointing here"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB hosted zone ID — used for Route53 alias records"
  value       = aws_lb.main.zone_id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain — CNAME static.<domain> here"
  value       = aws_cloudfront_distribution.static.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used for cache invalidation in CI/CD"
  value       = aws_cloudfront_distribution.static.id
}

output "s3_app_bucket" {
  value = aws_s3_bucket.app.bucket
}

output "s3_static_bucket" {
  value = aws_s3_bucket.static.bucket
}

output "ecr_repo_urls" {
  description = "ECR repository URLs keyed by repo name"
  value       = { for k, v in aws_ecr_repository.app : k => v.repository_url }
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (private)"
  value       = aws_db_instance.pg.address
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint (private)"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive   = true
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "waf_alb_arn" {
  value = aws_wafv2_web_acl.alb.arn
}
