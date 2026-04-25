# ── WAF for ALB (regional) ────────────────────────────────────
resource "aws_wafv2_web_acl" "alb" {
  name  = "${var.project}-${var.env}-alb-waf"
  scope = "REGIONAL"

  default_action { allow {} }

  # 1. AWS Managed — Core Rule Set (OWASP Top 10)
  rule {
    name     = "AWSManagedRulesCRS"
    priority = 10
    override_action { none {} }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCRS"
      sampled_requests_enabled   = true
    }
  }

  # 2. AWS Managed — Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputs"
    priority = 20
    override_action { none {} }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputs"
      sampled_requests_enabled   = true
    }
  }

  # 3. AWS Managed — SQL Injection
  rule {
    name     = "AWSManagedRulesSQLi"
    priority = 30
    override_action { none {} }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiRules"
      sampled_requests_enabled   = true
    }
  }

  # 4. Rate limiting — block IPs exceeding threshold per 5-min window
  rule {
    name     = "RateLimit"
    priority = 40
    action { block {} }

    statement {
      rate_based_statement {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimit"
      sampled_requests_enabled   = true
    }
  }

  # 5. Block requests with no User-Agent header
  rule {
    name     = "BlockNoUserAgent"
    priority = 50
    action { block {} }

    statement {
      not_statement {
        statement {
          size_constraint_statement {
            field_to_match { single_header { name = "user-agent" } }
            comparison_operator = "GT"
            size                = 0
            text_transformation { priority = 0; type = "NONE" }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BlockNoUserAgent"
      sampled_requests_enabled   = true
    }
  }

  # 6. IP allowlist for /admin paths
  rule {
    name     = "AdminIPAllowlist"
    priority = 5   # evaluated first
    action { block {} }

    statement {
      and_statement {
        statement {
          byte_match_statement {
            search_string         = "/admin"
            positional_constraint = "STARTS_WITH"
            field_to_match { uri_path {} }
            text_transformation { priority = 0; type = "LOWERCASE" }
          }
        }
        statement {
          not_statement {
            statement {
              ip_set_reference_statement {
                arn = aws_wafv2_ip_set.admin.arn
              }
            }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AdminIPAllowlist"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project}-${var.env}-alb-waf"
    sampled_requests_enabled   = true
  }

  tags = { Name = "${var.project}-${var.env}-alb-waf" }
}

resource "aws_wafv2_ip_set" "admin" {
  name               = "${var.project}-${var.env}-admin-ips"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"
  addresses          = [var.admin_cidr]
}

# Attach WAF to ALB
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.alb.arn
}

# ── WAF for CloudFront (must be us-east-1) ───────────────────
# CloudFront WAFs must be in us-east-1 regardless of stack region.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

resource "aws_wafv2_web_acl" "cloudfront" {
  provider = aws.us_east_1
  name     = "${var.project}-${var.env}-cf-waf"
  scope    = "CLOUDFRONT"

  default_action { allow {} }

  rule {
    name     = "AWSManagedRulesCRS"
    priority = 10
    override_action { none {} }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CF-AWSManagedRulesCRS"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "CF-RateLimit"
    priority = 20
    action { block {} }

    statement {
      rate_based_statement {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CF-RateLimit"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project}-${var.env}-cf-waf"
    sampled_requests_enabled   = true
  }

  tags = { Name = "${var.project}-${var.env}-cf-waf" }
}

# WAF logging — send to CloudWatch Logs
resource "aws_cloudwatch_log_group" "waf" {
  # WAF log group name must start with "aws-waf-logs-"
  name              = "aws-waf-logs-${var.project}-${var.env}"
  retention_in_days = 90
}

resource "aws_wafv2_web_acl_logging_configuration" "alb" {
  log_destination_configs = [aws_cloudwatch_log_group.waf.arn]
  resource_arn            = aws_wafv2_web_acl.alb.arn
}
