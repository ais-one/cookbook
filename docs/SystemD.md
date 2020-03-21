# Startup on VM using SystemD

https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/
https://www.freedesktop.org/software/systemd/man/systemd.service.html

```bash
cat << EOF > /lib/systemd/system/hello.service
[Unit]
Description=hello.js - your node application as service
Documentation=https://example.com
After=network.target

[Service]
Environment=NODE_ENV=production
Environment=REST_PORT=3000
Environment=WS_PORT=3001
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ubuntu/hello.js
# always = will always restart no matter what
Restart=on-failure
# ExecStopPost=

[Install]
WantedBy=multi-user.target
EOF
```

sudo systemctl daemon-reload



sudo systemctl start|stop|status|restart hello

sudo systemctl enable|disable hello


### Note

https://stackoverflow.com/questions/2953081/how-can-i-write-a-heredoc-to-a-file-in-bash-script

```bash
cat << 'EOF' > /tmp/yourfilehere
The variable $FOO will not be interpreted.
EOF
```


# curl -G "https://api.telegram.org/bot000000000:XXXXxxxxxxxxxxXXXXXXXXXX_xxxxxxxxxx/sendMessage?chat_id=183XXXXXX" --data-urlencode "text=Login IP `date`" > /dev/null

#!/bin/bash

TCP_CONN=`netstat -on | grep 3005 | wc -l`

echo $TCP_CONN

if [ "$TCP_CONN" -gt 2048 ]; then
	echo 'LHS: GT5 '+$TCP_CONN
	curl -X GET "https://sms.era.sg/tg_out.php?user=aaronjxz&msg=TCP%20overlimit%20${TCP_CONN}"
else
	echo 'LHS: LTE5 '+$TCP_CONN
fi



#!/bin/bash
#free && sync
#sudo sh -c 'echo 3 >/proc/sys/vm/drop_caches'
#free

HI="LHS: CPU `LC_ALL=C top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'`% RAM `free -m | awk '/Mem:/ { printf("%3.1f%%", $3/$2*100) }'` HDD `df -h / | awk '/\// {print $(NF-1)}'`"

# echo $HI

TCP_CONN=`netstat -on | grep 3005 | wc -l`

curl -G "https://sms.era.sg/tg_out.php?user=aaronjxz" --data-urlencode "msg=$HI TCP:$TCP_CONN"

#CPU=`grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}'`
#echo $CPU











# Configuring systemd to Run Multiple Instances

https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-2


```bash

cat << 'EOF' > /lib/systemd/system/hello_env@.service
[Unit]
Description=hello_env.js - making your environment variables rad
Documentation=https://example.com
After=network.target

[Service]
# Environment=NODE_PORT=%i
Type=simple
User=chl
ExecStart=/usr/bin/node /home/chl/hello_env.js --config /home/ubuntu/%i
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

```bash
for port in $(seq 3001 3004); do sudo systemctl start hello_env@$port; done
```

```bash
#!/bin/bash -e

PORTS="3001 3002 3003 3004"

for port in ${PORTS}; do
  systemctl stop hello_env@${port}
done

exit 0
```


## nginx

$ sudo apt-get update
$ sudo apt-get -y install nginx-full
$ sudo rm -fv /etc/nginx/sites-enabled/default
$ sudo nano /etc/nginx/sites-enabled/hello_env.conf
upstream hello_env {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
    server 127.0.0.1:3004;
}

server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://hello_env;
        proxy_set_header Host $host;
    }
}

sudo systemctl restart nginx