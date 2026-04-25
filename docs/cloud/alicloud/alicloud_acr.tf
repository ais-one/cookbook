# ============================================================
# ACR Enterprise instance
# Use "Basic" for personal/dev, "Standard"/"Advanced" for prod
# ============================================================
resource "alicloud_cr_ee_instance" "main" {
  payment_type   = "Subscription"
  period         = 1
  renew_period   = 1
  renewal_status = "AutoRenewal"
  instance_type  = "Advanced" # supports geo-replication & image scanning
  instance_name  = "${var.project}-${var.env}-acr"
}

# ============================================================
# Namespace — groups repositories by team/project
# ============================================================
resource "alicloud_cr_ee_namespace" "main" {
  instance_id        = alicloud_cr_ee_instance.main.id
  name               = var.acr_namespace
  auto_create        = false # don't auto-create repos on push
  default_visibility = "PRIVATE"
}

# ============================================================
# Repositories — one per deployable image
# ============================================================
resource "alicloud_cr_ee_repo" "app" {
  for_each = toset(var.acr_repos)

  instance_id = alicloud_cr_ee_instance.main.id
  namespace   = alicloud_cr_ee_namespace.main.name
  name        = each.value
  visibility  = "PRIVATE"
  repo_type   = "PRIVATE"
  summary     = "${each.value} container image"
}

# ============================================================
# RAM role for pulling images — used by FC and SAE
# ============================================================
resource "alicloud_ram_role" "acr_pull" {
  name        = "${var.project}-${var.env}-acr-pull-role"
  description = "Allows FC and SAE to pull images from ACR"

  document = jsonencode({
    Version = "1"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "fc.aliyuncs.com",
            "sae.aliyuncs.com",
          ]
        }
      }
    ]
  })
}

resource "alicloud_ram_policy" "acr_pull" {
  policy_name        = "${var.project}-${var.env}-acr-pull-policy"
  policy_description = "Read-only pull access to ACR images"

  document = jsonencode({
    Version = "1"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cr:GetAuthorizationToken",
          "cr:BatchGetImage",
          "cr:GetDownloadUrlForLayer",
          "cr:ListInstances",
          "cr:ListNamespace",
          "cr:ListRepository",
        ]
        Resource = "*"
      }
    ]
  })
}

resource "alicloud_ram_role_policy_attachment" "acr_pull" {
  role_name   = alicloud_ram_role.acr_pull.name
  policy_name = alicloud_ram_policy.acr_pull.policy_name
  policy_type = "Custom"
}
