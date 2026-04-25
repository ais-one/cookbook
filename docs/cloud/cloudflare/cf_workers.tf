# ── Worker script — SPA fallback ─────────────────────────────
# When the origin (S3/OSS) returns 404 for a client-side route,
# the Worker rewrites the request to /index.html instead.
# This avoids needing to configure custom error responses on the bucket.
resource "cloudflare_worker_script" "spa_fallback" {
  account_id = var.cloudflare_account_id
  name       = "${var.project}-${var.env}-spa-fallback"
  content    = <<-JS
    export default {
      async fetch(request, env) {
        const url = new URL(request.url);

        // Pass through requests with a file extension (assets)
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
          return fetch(request);
        }

        // For extensionless paths (SPA routes), fetch index.html
        const response = await fetch(request);

        if (response.status === 404 || response.status === 403) {
          const indexUrl = new URL('/index.html', url.origin);
          const indexResp = await fetch(indexUrl.toString(), {
            headers: request.headers,
          });
          // Return index.html with 200 so client-side routing takes over
          return new Response(indexResp.body, {
            status: 200,
            headers: indexResp.headers,
          });
        }

        return response;
      },
    };
  JS

  compatibility_date = "2024-01-01"

  tags = ["${var.project}", "${var.env}", "spa-fallback"]
}

# Attach Worker to the static subdomain
resource "cloudflare_worker_route" "spa_fallback" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.static_subdomain}.${var.root_domain}/*"
  script_name = cloudflare_worker_script.spa_fallback.name
}

# ── Cache purge helper ────────────────────────────────────────
# Called from CI/CD after a static deploy to bust the Cloudflare cache.
# Usage: terraform apply -target=null_resource.cache_purge
# Or invoke the Cloudflare API directly in your pipeline:
#   curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
#     -H "Authorization: Bearer $CF_API_TOKEN" \
#     -H "Content-Type: application/json" \
#     -d '{"purge_everything": true}'
#
# The cloudflare_purge_cache resource triggers on every apply when
# you want Terraform itself to purge (e.g. post-deploy hook).
# Comment out if you handle purge in CI/CD instead (recommended).
resource "cloudflare_purge_cache" "static_deploy" {
  zone_id = var.cloudflare_zone_id
  purge_everything = false   # set to true for a full purge, or use prefixes below

  # Purge only HTML files to minimise CDN misses on hashed assets
  prefixes = [
    "https://${var.static_subdomain}.${var.root_domain}/",
    "https://${var.static_subdomain}.${var.root_domain}/index.html",
  ]

  # Only run this when the worker script changes (i.e. on deploy)
  depends_on = [cloudflare_worker_script.spa_fallback]

  lifecycle {
    # Don't auto-purge on every plan — only when explicitly triggered
    ignore_changes = [prefixes]
  }
}
