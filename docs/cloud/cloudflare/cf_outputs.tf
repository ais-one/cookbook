output "api_url" {
  description = "Public API URL via Cloudflare proxy"
  value       = "https://${var.api_subdomain}.${var.root_domain}"
}

output "static_url" {
  description = "Public static site URL via Cloudflare CDN"
  value       = "https://${var.static_subdomain}.${var.root_domain}"
}

output "cloudflare_nameservers" {
  description = "Cloudflare nameservers — set these at your domain registrar"
  value       = data.cloudflare_zone.main.name_servers
}

output "spa_worker_name" {
  description = "Cloudflare Worker name for SPA fallback"
  value       = cloudflare_worker_script.spa_fallback.name
}
