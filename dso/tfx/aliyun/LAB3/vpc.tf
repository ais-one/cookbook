variable "vs_zone" {
  default = "us-west-1a"
}

# Create VPC
resource "alicloud_vpc" "labex_vpc" {
  vpc_name   = "labex_vpc"
  cidr_block = "172.16.0.0/12"
}

# Create Vswitch
resource "alicloud_vswitch" "labex_vs" {
  vpc_id            = alicloud_vpc.labex_vpc.id
  cidr_block        = "172.16.0.0/21"
  zone_id = var.vs_zone
}

# Create security group
resource "alicloud_security_group" "default" {
  name        = "terraform-default"
  description = "terraform-default"
  vpc_id      = alicloud_vpc.labex_vpc.id
}

# Create Security group rule
resource "alicloud_security_group_rule" "allow_all_tcp" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "22/81"
  priority          = 1
  security_group_id = alicloud_security_group.default.id
  cidr_ip           = "0.0.0.0/0"
}