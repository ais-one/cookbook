provider "alicloud" {
  # access_key = "${access-key}"
  # secret_key = "${secret-key}"
  access_key = "LTAI5t9QkJm4787dDaKp4P3g"
  secret_key = "pui6CH99pBk45UuG0JAhTp2iVGUlcO"
  region = "us-west-1"
}

# 1. VPC
data "alicloud_zones" "default" {
  available_resource_creation = "Rds"
}

resource "alicloud_vpc" "default" {
  vpc_name   = "vpc-rds-postgresql"
  cidr_block = "172.16.0.0/16"
}

resource "alicloud_vswitch" "default" {
  vpc_id       = alicloud_vpc.default.id
  cidr_block   = "172.16.0.0/24"
  zone_id      = data.alicloud_zones.default.zones[0].id
  vswitch_name = "vsw-rds-postgresql"
}

resource "alicloud_security_group" "group" {
  name        = "sg_rds_pg"
  description = "Security group for AnalyticDB for PostgreSQL"
  vpc_id      = alicloud_vpc.default.id
}

resource "alicloud_security_group_rule" "allow_ssh_22" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "22/22"
  priority          = 1
  security_group_id = alicloud_security_group.group.id
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_security_group_rule" "allow_ssh_8080" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "8080/8080"
  priority          = 1
  security_group_id = alicloud_security_group.group.id
  cidr_ip           = "0.0.0.0/0"
}

# 2. ECS
resource "alicloud_instance" "instance" {
  security_groups = alicloud_security_group.group.*.id
  instance_type           = "ecs.n4.small"
  system_disk_category    = "cloud_efficiency"
  system_disk_name        = "rdspg_tpch_system_disk"
  system_disk_size        = 40
  system_disk_description = "rdspg_tpch_system_disk"
  image_id                = "ubuntu_20_04_x64_20G_alibase_20210824.vhd"
  instance_name           = "rdspg_tpch"
  password                = "Aliyun-test" ## Please change accordingly
  instance_charge_type    = "PostPaid"
  vswitch_id              = alicloud_vswitch.default.id
}

resource "alicloud_eip" "setup_ecs_access" {
  bandwidth            = "5"
  internet_charge_type = "PayByBandwidth"
}

resource "alicloud_eip_association" "eip_ecs" {
  allocation_id = alicloud_eip.setup_ecs_access.id
  instance_id   = alicloud_instance.instance.id
}

# 3. RDS PostgreSQL
resource "alicloud_db_instance" "instance" {
  engine           = "PostgreSQL"
  engine_version   = "13.0"
  instance_type    = "pg.n2.large.1"
  instance_storage = "80"
  vswitch_id       = alicloud_vswitch.default.id
  instance_name    = "apache_superset_database"
  security_ips     = [alicloud_vswitch.default.cidr_block]
}

resource "alicloud_db_database" "default" {
  instance_id = alicloud_db_instance.instance.id
  name        = "atlas_of_thrones"
}

resource "alicloud_rds_account" "account" {
  db_instance_id   = alicloud_db_instance.instance.id
  account_name     = "patrick"
  account_password = "the_best_passsword"
  account_type     = "Super"
}

resource "alicloud_db_account_privilege" "privilege" {
  instance_id  = alicloud_db_instance.instance.id
  account_name = alicloud_rds_account.account.name
  privilege    = "DBOwner"
  db_names     = alicloud_db_database.default.*.name
}

# 4. Redis

resource "alicloud_kvstore_instance" "example" {
  db_instance_name      = "patrick-redis"
  vswitch_id            = alicloud_vswitch.default.id
  security_ips          = [alicloud_vswitch.default.cidr_block]
  instance_type         = "Redis"
  engine_version        = "4.0"
  config = {
    appendonly = "yes",
    lazyfree-lazy-eviction = "yes",
  }
  tags = {
    Created = "TF",
    For = "Test",
  }
  resource_group_id     = "rg-123456"
  # zone_id               = "cn-hongkong-b"
  instance_class        = "redis.basic.mid.default"
  password              = "Aliyuntest123"
  vpc_auth_mode         = "Close"
}

# 5. Output 

output "eip_ecs" {
  value = alicloud_eip.setup_ecs_access.ip_address
}

output "rds_pg_url" {
  value = alicloud_db_instance.instance.connection_string
}

output "redis_url" {
  value = alicloud_kvstore_instance.example.connection_domain
}