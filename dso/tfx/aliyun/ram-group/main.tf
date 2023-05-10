provider "alicloud" {
  access_key = "TBD"
  secret_key = "TBD"
  region = "ap-southeast-1"
}

# Create a new RAM Group.
resource "alicloud_ram_group" "develop" {
  name     = "develop_group"
  comments = "this is a develop group comments."
  force    = true
}

resource "alicloud_ram_group" "operation" {
  name     = "operation_group"
  comments = "this is a operation group comments."
  force    = true
}

resource "alicloud_ram_user" "user1" {
  name         = "LabEx_user1"
  display_name = "LabEx_user1_display"
  mobile       = "86-18688888888"
  email        = "hello.uuu@aaa.com"
  comments     = "develop_group"
  force        = true
}

resource "alicloud_ram_user" "user2" {
  name         = "LabEx_test2"
  display_name = "LabEx_user2_display"
  mobile       = "86-18688888889"
  email        = "hello.uuu@aaa.com"
  comments     = "operation_group"
  force        = true
}

resource "alicloud_ram_group_membership" "membership1" {
  group_name = alicloud_ram_group.develop.name
  user_names = [alicloud_ram_user.user1.name]
}

resource "alicloud_ram_group_membership" "membership2" {
  group_name = alicloud_ram_group.operation.name
  user_names = [alicloud_ram_user.user2.name]
}

resource "alicloud_ram_policy" "policy_develop" {
  policy_name        = "policy_develop"
  policy_document    = <<EOF
  {
    "Statement": [
      {
        "Action": [
          "ecs:*List*",
          "ecs:*Get*"
        ],
        "Effect": "Allow",
        "Resource": [
          "acs:*:ap-southeast-1:*:*"
        ]
      }
    ],
      "Version": "1"
  }
  EOF
  description = "this is a develop policy"
  force       = true
}

resource "alicloud_ram_policy" "policy_operation" {
  policy_name        = "policy_operation"
  policy_document    = <<EOF
  {
    "Statement": [
      {
        "Action": [
          "ecs:*List*",
          "ecs:*Get*"
        ],
        "Effect": "Allow",
        "Resource": [
          "acs:*:us-west-1:*:*"
        ]
      }
    ],
      "Version": "1"
  }
  EOF
  description = "this is a operation policy"
  force       = true
}


resource "alicloud_ram_group_policy_attachment" "attach_develop" {
  policy_name = alicloud_ram_policy.policy_develop.name
  policy_type = alicloud_ram_policy.policy_develop.type
  group_name  = alicloud_ram_group.develop.name
}

resource "alicloud_ram_group_policy_attachment" "attach_operation" {
  policy_name = alicloud_ram_policy.policy_operation.name
  policy_type = alicloud_ram_policy.policy_operation.type
  group_name  = alicloud_ram_group.operation.name
}


# Output
output "operation_group_name" {
  description = "operation group name"
  value       = alicloud_ram_group.operation.name
}

output "develop_group_name" {
  description = "develop group name"
  value       = alicloud_ram_group.develop.name
}

output "ram_user1_id" {
  description = "ram user1 id"
  value       = alicloud_ram_user.user1.id
}

output "ram_user2_id" {
  description = "ram user2 id"
  value       = alicloud_ram_user.user2.id
}
