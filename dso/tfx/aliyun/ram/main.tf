provider "alicloud" {
  access_key = "TBD"
  secret_key = "TBD"
  region = "ap-southeast-1"
}

# Create a RAM User Policy attachment.
resource "alicloud_ram_user" "user" {
  name         = "LabEx-Ram"
  display_name = "LabEx-Ram-display"
  mobile       = "86-18688888888"
  email        = "hello.uuu@aaa.com"
  comments     = "yoyoyo"
  force        = true
}

resource "alicloud_ram_login_profile" "profile" {
  user_name = alicloud_ram_user.user.name
  password  = "Aliyun-test"
  password_reset_required = false
}


resource "alicloud_ram_policy" "policy" {
  policy_name        = "LabEx_policy"
  policy_document    = <<EOF
  {
    "Version": "1",
    "Statement": [
        {
            "Action": "ecs:Describe*",
            "Resource": "acs:*:ap-southeast-1:*:*",
            "Effect": "Allow"
        },
        {
            "Action": "ecs:List*",
            "Resource": "acs:*:ap-southeast-1:*:*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "vpc:DescribeVpcs",
                "vpc:DescribeVSwitches"
            ],
            "Resource": "acs:*:ap-southeast-1:*:*",
            "Effect": "Allow"
        }
    ]
}
  EOF
  description = "this is a policy test"
  force       = true
}

resource "alicloud_ram_user_policy_attachment" "attach" {
  policy_name = alicloud_ram_policy.policy.name
  policy_type = alicloud_ram_policy.policy.type
  user_name   = alicloud_ram_user.user.name
}

# Output
output "ram_user_id" {
  description = "ram user id"
  value       = alicloud_ram_user.user.id
}
