# Look up the zone to expose nameservers in outputs
data "cloudflare_zone" "main" {
  zone_id = var.cloudflare_zone_id
}
