variable "slb_type" {
  default = "slb.s2.small"
}

resource "alicloud_slb" "labex_slb" {
  load_balancer_name = "labex_slb"
  load_balancer_spec = var.slb_type
  address_type  = "internet"
  #vswitch_id    = alicloud_vswitch.default.id
  payment_type = "PayAsYouGo"
  tags = {
    tag_a = 1
    tag_b = 2
  }
}

resource "alicloud_slb_listener" "default" {
  load_balancer_id          = alicloud_slb.labex_slb.id
  backend_port              = 80
  frontend_port             = 80
  protocol                  = "http"
  bandwidth                 = 10
  sticky_session            = "on"
  sticky_session_type       = "insert"
  cookie_timeout            = 86400
  health_check              = "on"
  health_check_timeout      = 8
  health_check_interval     = 5
  health_check_http_code    = "http_2xx,http_3xx"
  x_forwarded_for {
    retrive_slb_ip = true
    retrive_slb_id = true
  }
  request_timeout = 80
  idle_timeout    = 30
}

resource "alicloud_slb_backend_server" "default" {
  load_balancer_id = alicloud_slb.labex_slb.id

  backend_servers {
    server_id = alicloud_instance.labex[0].id
    weight    = 100
  }
  backend_servers {
    server_id = alicloud_instance.labex[1].id
    weight    = 100
  }
}
