# DEPLOYMENT ON CLOUD (OPTIONAL)

## SSH Keys For use with ssh, scp

generate private and public keys

```bash
# -t dsa|rsa|ecdsa|ed25519
# -b 521|2048...
ssh-keygen -f ./id_rsa -t rsa -b 2048
```

## SSL Certs For use with on web applications

1. generate self-signed cert

```bash
# private key: privkey.pem
# public cert self-signed: fullchain.pem
# -nodes = no DES if not pass phrase
# -subj "/C=SG/ST=Singapore/L=Singapore/O=My Group/OU=My Unit/CN=127.0.0.1"
openssl req -x509 -newkey rsa:2048 -keyout privkey.pem -out fullchain.pem -days 3650 -nodes  -subj "/CN=127.0.0.1"
```

2. generate private key and CSR

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout id_rsa -out id_rsa.csr -days 3650 -subj "/CN=127.0.0.1"
```

alternative generate only private key

```bash
# linux
openssl genrsa -des3 -out id_rsa 2048

# windows
openssl genrsa -out id_rsa 2048
```

3. generate CSR from exiting private key

```bash
openssl req -new -key id_rsa -out id_rsa.csr -subj "/CN=127.0.0.1"
```

## Generate SSL Keys using Certbot

https://certbot.eff.org/


```bash
$ sudo apt-get update
$ sudo apt-get install -y software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install certbot 
```


https://certbot.eff.org/docs/using.html#renewing-certificates

```bash
sudo service apache2 stop
# sudo certbot certonly --standalone -d <subdomain>.example.com
sudo certbot certonly --standalone --preferred-challenges http -d <domain>
sudo service apache2 start
```

### Test Renewal

```bash
sudo certbot renew --dry-run --pre-hook "sudo service apache2 stop" --post-hook "sudo service apache2 start"
```

### Live Renewal in crontab

```bash
sudo certbot renew --pre-hook "sudo service apache2 stop" --post-hook "sudo service apache2 start"
```

### so you can read renewed certs

```bash
sudo su
chmod +rx /etc/letsencrypt/live
chmod +rx /etc/letsencrypt/archive
```

## Using port below 1024

### Method 1 - Use Authbind (Preferred)

http://pm2.keymetrics.io/docs/usage/specifics/#listening-on-port-80-w-o-root

```bash
sudo apt-get install authbind
sudo touch /etc/authbind/byport/443
sudo chown ubuntu /etc/authbind/byport/443
sudo chmod 755 /etc/authbind/byport/443
```

```bash
~/.bashrc
alias pm2='authbind --deep pm2'
```

source ~/.bashrc

**package.json**
"production-start": "ssh -i ../../test.pem ubuntu@127.0.0.1 \"cd ~/api; authbind --deep pm2 start --only api --env production;\"",
"production-stop": "ssh -i ../../test.pem ubuntu@127.0.0.1 \"cd ~/api; pm2 delete api;\"",

### Method 2 - Create Safe User

https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps


## Running on VM (eg. Droplet / EC2 / GCE)

### node / nodemon

```bash
NODE_ENV=development nohup node index.js >> /dev/null 2>&1 &
```

```kill
ps ax | grep 'node index.js' | grep -v grep | awk '{print $1}' | xargs kill
```

### use pm2

See js-node/expressjs/ecosystem.config.js


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

```bash
sudo systemctl daemon-reload
sudo systemctl start|stop|status|restart hello
sudo systemctl enable|disable hello
```

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

```bash
sudo apt-get update
sudo apt-get -y install nginx-full
sudo rm -fv /etc/nginx/sites-enabled/default

cat << 'EOF' > /etc/nginx/sites-enabled/hello_env.conf
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
EOF

sudo systemctl restart nginx
```

## Fail2ban

https://www.techrepublic.com/article/how-to-install-fail2ban-on-ubuntu-server-18-04/

```bash
sudo apt-get install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

cat << 'EOF' > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

sudo systemctl restart fail2ban

sudo fail2ban-client set sshd unbanip IP_ADDRESS
```


## Installation - NodeJS and MongoDB

```bash
#!/bin/bash

# Install NodeJS 12.x
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
# sudo apt-get install -y build-essential

# Allow lower ports
sudo apt-get install -y authbind
sudo touch /etc/authbind/byport/80
sudo chown ubuntu /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
sudo touch /etc/authbind/byport/443
sudo chown ubuntu /etc/authbind/byport/443
sudo chmod 755 /etc/authbind/byport/443

# Install MongoDB 4.2
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Removing MongoDB
# sudo service mongod stop
# sudo apt-get purge mongodb-org*
# sudo rm -r /var/log/mongodb
# sudo rm -r /var/lib/mongodb
# TBD Setup RS if necessary
```
