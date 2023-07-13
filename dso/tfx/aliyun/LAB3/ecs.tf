variable "ecs_type" {
  default = "ecs.hfc6.large"
}

variable "wordpress_image" {
  default = "m-rj9a5l541nbz5ugvlznu"
}

variable "ecs_password" {
  default = "Aliyun-test"
}

# Create a server
resource "alicloud_instance" "labex" {
  count                 = 2
  image_id              = var.wordpress_image
  internet_charge_type  = "PayByBandwidth"
  instance_type         = var.ecs_type
  system_disk_category  = "cloud_efficiency"
  security_groups       = [alicloud_security_group.default.id]
  instance_name         = "labex"
  vswitch_id            = alicloud_vswitch.labex_vs.id
  password              = var.ecs_password
  internet_max_bandwidth_out = 1
  user_data             = "#!/bin/bash\nsed -i 's/database_name_here/${var.db_name}/g' /var/www/wordpress/wp-config.php\nsed -i 's/username_here/${var.db_user_name}/g' /var/www/wordpress/wp-config.php\nsed -i 's/password_here/${var.db_user_password}/g' /var/www/wordpress/wp-config.php\nsed -i 's/localhost/${alicloud_db_connection.conn.connection_string}/g' /var/www/wordpress/wp-config.php\nsed -i 's/utf8/utf8mb4/g' /var/www/wordpress/wp-config.php\nservice nginx start\nservice php7.0-fpm start"
}