# ============================================================
# WAF v3 Instance
# edition: "BasicEdition" | "ProEdition" | "EnterpriseEdition"
# Use ProEdition+ for managed rule groups and bot management
# ============================================================
resource "alicloud_wafv3_instance" "main" {
  pay_type  = "PostPaid"  # switch to "PrePaid" + period for reserved pricing
  region    = var.region
}

# ============================================================
# Protect the ALB — bind the load balancer to WAF
# All traffic hitting the ALB is now inspected by WAF first
# ============================================================
resource "alicloud_wafv3_defense_resource" "alb" {
  instance_id   = alicloud_wafv3_instance.main.id
  resource      = alicloud_alb_load_balancer.fc.id   # ALB instance ID
  resource_type = "alb"
  address       = alicloud_alb_load_balancer.fc.dns_name
  port          = "443"
  ssl_protocol  = "tls1.2+"
}

# ============================================================
# Defense template — groups rule sets applied to resources
# ============================================================
resource "alicloud_wafv3_defense_template" "main" {
  instance_id           = alicloud_wafv3_instance.main.id
  defense_template_name = "${var.project}-${var.env}-waf-template"
  template_type         = "user_custom"
  template_origin       = "custom"
  description           = "WAF rules for ${var.project} ${var.env}"
}

# ============================================================
# Rule sets — attach built-in managed rule groups
# ============================================================

# Core rule set — OWASP Top 10 protection
resource "alicloud_wafv3_defense_resource_group" "alb_owasp" {
  instance_id        = alicloud_wafv3_instance.main.id
  defense_resource   = alicloud_wafv3_defense_resource.alb.resource
  defense_template_id = alicloud_wafv3_defense_template.main.id
}

# ============================================================
# Custom WAF rules
# ============================================================

# Rate limiting — block IPs that exceed 500 req/s per IP
resource "alicloud_wafv3_custom_response" "rate_limit_response" {
  instance_id   = alicloud_wafv3_instance.main.id
  response_name = "rate-limit-429"
  status        = "429"
  http_headers = [
    {
      key   = "Content-Type"
      value = "application/json"
    }
  ]
  body = jsonencode({
    error   = "Too Many Requests"
    message = "Rate limit exceeded. Please slow down."
  })
}

# Block requests with no User-Agent header (common bot signal)
resource "alicloud_wafv3_custom_rule" "block_no_ua" {
  instance_id    = alicloud_wafv3_instance.main.id
  rule_name      = "block-no-user-agent"
  status         = "1"   # enabled
  defense_scene  = "custom_acl"

  conditions = jsonencode([
    {
      field    = "Header"
      subField = "User-Agent"
      opCode   = "empty"
    }
  ])

  action = jsonencode({
    actionType = "block"
    statusCode = 403
  })
}

# IP allowlist for admin paths — only your office/VPN CIDRs
resource "alicloud_wafv3_custom_rule" "admin_allowlist" {
  instance_id    = alicloud_wafv3_instance.main.id
  rule_name      = "admin-ip-allowlist"
  status         = "1"
  defense_scene  = "custom_acl"
  priority       = 5   # lower = evaluated first

  conditions = jsonencode([
    {
      field   = "URL"
      opCode  = "prefix-match"
      values  = ["/admin"]
    },
    {
      field   = "IP"
      opCode  = "not-ip-match"
      values  = ["203.0.113.0/24"]  # replace with your office/VPN CIDR
    }
  ])

  action = jsonencode({
    actionType = "block"
    statusCode = 403
  })
}

# ============================================================
# WAF logs → SLS (Simple Log Service)
# Full request/response logging for audit and incident response
# ============================================================
resource "alicloud_log_project" "waf" {
  project_name = "${var.project}-${var.env}-waf-logs"
  description  = "WAF access and attack logs"
}

resource "alicloud_log_store" "waf_access" {
  project_name          = alicloud_log_project.waf.project_name
  logstore_name         = "waf-access-logs"
  shard_count           = 2
  auto_split            = true
  max_split_shard_count = 32
  retention_period      = 90   # days — extend for compliance requirements
}

resource "alicloud_log_store" "waf_attack" {
  project_name          = alicloud_log_project.waf.project_name
  logstore_name         = "waf-attack-logs"
  shard_count           = 2
  auto_split            = true
  max_split_shard_count = 32
  retention_period      = 180  # keep attack logs longer
}
