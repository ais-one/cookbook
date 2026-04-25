# ============================================================
# VPC
# ============================================================
resource "alicloud_vpc" "main" {
  vpc_name   = "${var.project}-${var.env}-vpc"
  cidr_block = var.vpc_cidr
}

# ============================================================
# vSwitches (subnets)
# ============================================================
resource "alicloud_vswitch" "public" {
  count = length(var.public_subnets)

  vpc_id       = alicloud_vpc.main.id
  cidr_block   = var.public_subnets[count.index]
  zone_id      = var.availability_zones[count.index]
  vswitch_name = "${var.project}-${var.env}-public-${count.index + 1}"
}

resource "alicloud_vswitch" "private" {
  count = length(var.private_subnets)

  vpc_id       = alicloud_vpc.main.id
  cidr_block   = var.private_subnets[count.index]
  zone_id      = var.availability_zones[count.index]
  vswitch_name = "${var.project}-${var.env}-private-${count.index + 1}"
}

# ============================================================
# EIP — static public IP for outgoing NAT traffic
# ============================================================
resource "alicloud_eip_address" "nat" {
  address_name         = "${var.project}-${var.env}-nat-eip"
  internet_charge_type = "PayByTraffic"
  bandwidth            = "100" # Mbps — adjust to your needs
  isp                  = "BGP"
}

# ============================================================
# NAT Gateway (enhanced type — recommended)
# ============================================================
resource "alicloud_nat_gateway" "main" {
  vpc_id           = alicloud_vpc.main.id
  vswitch_id       = alicloud_vswitch.public[0].id
  nat_gateway_name = "${var.project}-${var.env}-nat"
  nat_type         = "Enhanced"
  payment_type     = "PayAsYouGo"

  # Prevent accidental destruction (EIP/SNAT rules depend on this)
  lifecycle {
    prevent_destroy = true
  }
}

# Bind EIP to NAT gateway
resource "alicloud_eip_association" "nat" {
  allocation_id = alicloud_eip_address.nat.id
  instance_id   = alicloud_nat_gateway.main.id
  instance_type = "Nat"
}

# ============================================================
# SNAT rule — route all private subnet traffic out via the EIP
# ============================================================
resource "alicloud_snat_entry" "private" {
  count = length(var.private_subnets)

  depends_on        = [alicloud_eip_association.nat]
  snat_table_id     = alicloud_nat_gateway.main.snat_table_ids
  source_vswitch_id = alicloud_vswitch.private[count.index].id
  snat_ip           = alicloud_eip_address.nat.ip_address
  snat_entry_name   = "${var.project}-${var.env}-snat-private-${count.index + 1}"
}

# ============================================================
# Security groups
# ============================================================

# App security group (for ECS / Function Compute VPC binding)
resource "alicloud_security_group" "app" {
  name   = "${var.project}-${var.env}-app-sg"
  vpc_id = alicloud_vpc.main.id
}

# RDS security group — only allow inbound from app sg
resource "alicloud_security_group" "rds" {
  name   = "${var.project}-${var.env}-rds-sg"
  vpc_id = alicloud_vpc.main.id
}

resource "alicloud_security_group_rule" "rds_from_app" {
  type                     = "ingress"
  ip_protocol              = "tcp"
  nic_type                 = "intranet"
  policy                   = "accept"
  port_range               = "5432/5432"
  priority                 = 1
  security_group_id        = alicloud_security_group.rds.id
  source_security_group_id = alicloud_security_group.app.id
}

# Redis security group — only allow inbound from app sg
resource "alicloud_security_group" "redis" {
  name   = "${var.project}-${var.env}-redis-sg"
  vpc_id = alicloud_vpc.main.id
}

resource "alicloud_security_group_rule" "redis_from_app" {
  type                     = "ingress"
  ip_protocol              = "tcp"
  nic_type                 = "intranet"
  policy                   = "accept"
  port_range               = "6379/6379"
  priority                 = 1
  security_group_id        = alicloud_security_group.redis.id
  source_security_group_id = alicloud_security_group.app.id
}
