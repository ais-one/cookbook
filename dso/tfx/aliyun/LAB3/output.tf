output "ecs_id0" {
  value = alicloud_instance.labex[0].id
}

output "ecs_id1" {
  value = alicloud_instance.labex[1].id
}

output "vpc_id" {
  value = alicloud_vpc.labex_vpc.id
}

output "rds_id" {
  value = alicloud_db_instance.labex.id
}

output "slb_id" {
  value = alicloud_slb.labex_slb.id
}
