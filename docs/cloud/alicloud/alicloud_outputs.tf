output "waf_instance_id" {
  description = "WAF instance ID"
  value       = alicloud_wafv3_instance.main.id
}

output "cdn_static_domain" {
  description = "DCDN accelerated domain for static site — create CNAME pointing here"
  value       = alicloud_dcdn_domain.static.cname
}

output "cdn_static_url" {
  description = "Public HTTPS URL for the CDN-accelerated static site"
  value       = "https://static.${var.domain_name}"
}

output "alb_public_dns" {
  description = "ALB public DNS name — create a CNAME record pointing your domain here"
  value       = alicloud_alb_load_balancer.fc.dns_name
}

output "alb_https_endpoint" {
  description = "Public HTTPS endpoint via ALB"
  value       = "https://${var.domain_name}"
}

output "alb_id" {
  description = "ALB instance ID"
  value       = alicloud_alb_load_balancer.fc.id
}

output "vpc_id" {
  value = alicloud_vpc.main.id
}

output "nat_public_ip" {
  description = "Static outgoing public IP via NAT gateway"
  value       = alicloud_eip_address.nat.ip_address
}

output "oss_app_bucket" {
  value = alicloud_oss_bucket.app.bucket
}

output "oss_static_website_endpoint" {
  description = "Public static hosting endpoint"
  value       = alicloud_oss_bucket.static.extranet_endpoint
}

output "acr_instance_id" {
  description = "ACR Enterprise instance ID — used to build image URLs"
  value       = alicloud_cr_ee_instance.main.id
}

output "acr_image_base" {
  description = "Base URL for pushing/pulling ACR images"
  value       = "${alicloud_cr_ee_instance.main.id}.cr.aliyuncs.com/${var.acr_namespace}"
}

output "rds_connection_string" {
  description = "Internal RDS endpoint (use inside VPC only)"
  value       = alicloud_db_instance.pg.connection_string
  sensitive   = true
}

output "redis_connection_domain" {
  description = "Internal Redis endpoint (use inside VPC only)"
  value       = alicloud_kvstore_instance.redis.connection_domain
  sensitive   = true
}

output "fc_http_trigger_url" {
  description = "Public HTTP endpoint for the function"
  value       = alicloud_fcv3_trigger.http.url_internet
}

output "sae_app_id" {
  description = "SAE application ID"
  value       = alicloud_sae_application.app.id
}

output "sae_ingress_slb_ip" {
  description = "Public IP of the SAE ingress load balancer"
  value       = alicloud_sae_ingress.app.slb_ip
}
