provider "alicloud"{
  access_key = "LTAI5t7LhWzCuWosiwrA6dkh"
  secret_key = "2bS3lhsREWlmDhpHdZ6IYHOBmNC761"
  region = "ap-southeast-1"
}

# Create a new RAM Role.
resource "alicloud_ram_role" "role"{
  name = "LabExRole"
  document = <<EOF
  {
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
          "RAM": [
            "acs:ram::u5128815724922318:root"
          ]
        }
      }
    ],
    "Version": "1"
  }
  EOF
  description = "this is a role test ."
  force = true
}


resource "alicloud_ram_policy" "policy"{
  policy_name = "LabEx_policy"
  policy_document = <<EOF
  {
    "Statement": [
      {
        "Action": [
          "oss:ListObjects",
          "oss:GetObject"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
    ],
      "Version": "1"
  }
  EOF
  description = "this is a policy test"
  force = true
}

resource "alicloud_ram_role_policy_attachment" "attach"{
  policy_name = alicloud_ram_policy.policy.name
  policy_type = alicloud_ram_policy.policy.type
  role_name = alicloud_ram_role.role.name
}

output "role_name"{
  description = "ram role name"
  value = alicloud_ram_role.role.id
}