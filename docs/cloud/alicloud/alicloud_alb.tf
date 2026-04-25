# ============================================================
# ALB Instance — internet-facing, spans both public vSwitches
# ============================================================
resource "alicloud_alb_load_balancer" "fc" {
  load_balancer_name    = var.alb_name
  load_balancer_edition = "Standard"
  address_type          = "Internet"
  address_ip_version    = "IPv4"
  vpc_id                = alicloud_vpc.main.id

  zone_mappings {
    zone_id    = var.availability_zones[0]
    vswitch_id = alicloud_vswitch.public[0].id
  }

  zone_mappings {
    zone_id    = var.availability_zones[1]
    vswitch_id = alicloud_vswitch.public[1].id
  }

  resource_group_id = null  # uses default resource group

  deletion_protection_enabled = true

  tags = {
    project = var.project
    env     = var.env
  }
}

# ============================================================
# Security group for ALB → FC traffic
# Allow ALB to reach Function Compute VPC binding on port 9000
# (FC internal HTTP port; ALB forwards to this)
# ============================================================
resource "alicloud_security_group_rule" "alb_to_fc" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "9000/9000"
  priority          = 1
  security_group_id = alicloud_security_group.app.id
  cidr_ip           = "0.0.0.0/0"  # ALB uses dynamic IPs; restrict via SG on ALB side if needed
}

# ============================================================
# Server Group — wraps the FC HTTP trigger as a backend
# ALB routes requests to the FC trigger URL
# ============================================================
resource "alicloud_alb_server_group" "fc" {
  server_group_name = "${var.project}-${var.env}-fc-sg"
  server_group_type = "Fc"   # Function Compute backend type
  vpc_id            = alicloud_vpc.main.id

  health_check_config {
    health_check_enabled  = true
    health_check_path     = "/health"
    health_check_protocol = "HTTP"
    health_check_codes    = ["http_2xx", "http_3xx"]
    health_check_interval = 10  # seconds
    health_check_timeout  = 5
    healthy_threshold     = 2
    unhealthy_threshold   = 3
  }

  sticky_session_config {
    sticky_session_enabled = false
  }
}

# Register the FC function as a backend server
resource "alicloud_alb_server_group_server_attachment" "fc" {
  server_group_id = alicloud_alb_server_group.fc.id
  server_type     = "Fc"

  # Reference the FC function ARN
  server_id = alicloud_fcv3_function.app.function_name
  weight    = 100

  fc_config {
    function_name = alicloud_fcv3_function.app.function_name
    qualifier     = "LATEST"  # pin to a published version for prod stability
  }
}

# ============================================================
# HTTPS Listener — port 443, SSL termination at ALB
# ============================================================
resource "alicloud_alb_listener" "https" {
  load_balancer_id     = alicloud_alb_load_balancer.fc.id
  listener_protocol    = "HTTPS"
  listener_port        = 443
  listener_description = "${var.project}-${var.env} HTTPS"

  default_actions {
    type = "ForwardGroup"
    forward_group_config {
      server_group_tuples {
        server_group_id = alicloud_alb_server_group.fc.id
        weight          = 100
      }
    }
  }

  # SSL certificate (uploaded to AliCloud SSL Certificates Service)
  certificates {
    certificate_id = var.alb_ssl_cert_id
  }

  # TLS policy — TLSCipher policy 1.1 enforces TLS 1.2+ and strong ciphers
  security_policy_id = "tls_cipher_policy_1_1"

  # HTTP/2 for performance
  http2_enabled = true

  idle_timeout         = 15   # seconds — tune to your FC timeout
  request_timeout      = 60
}

# ============================================================
# HTTP Listener — port 80, redirect all traffic to HTTPS
# ============================================================
resource "alicloud_alb_listener" "http_redirect" {
  load_balancer_id     = alicloud_alb_load_balancer.fc.id
  listener_protocol    = "HTTP"
  listener_port        = 80
  listener_description = "${var.project}-${var.env} HTTP→HTTPS redirect"

  default_actions {
    type = "Redirect"
    redirect_config {
      protocol    = "HTTPS"
      port        = "443"
      http_code   = "Http301"
    }
  }
}

# ============================================================
# ALB Listener Rule — route by domain and path prefix
# Allows the same ALB to serve multiple domains/services later
# ============================================================
resource "alicloud_alb_rule" "api_domain" {
  listener_id = alicloud_alb_listener.https.id
  rule_name   = "api-domain-rule"
  priority    = 10

  rule_conditions {
    type = "Host"
    host_config {
      values = [var.domain_name]
    }
  }

  rule_actions {
    order = 1
    type  = "ForwardGroup"
    forward_group_config {
      server_group_tuples {
        server_group_id = alicloud_alb_server_group.fc.id
        weight          = 100
      }
    }
  }
}

# ============================================================
# WAF association (optional but recommended for public endpoints)
# Uncomment once you have a WAF instance provisioned.
# ============================================================
# resource "alicloud_wafv3_defense_resource_group" "alb" {
#   instance_id   = var.waf_instance_id
#   resource_arns = [alicloud_alb_load_balancer.fc.load_balancer_id]
# }
