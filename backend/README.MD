# REST Example

## Quick Start

```
cd api
npm run dev
cd ..
cd web
npm run serve
```

## Backend

ExpressJS Server

Commands:
    see package.json

Config Files
    .env.development
    .env.production
    knexfile.js
    ecosystem.config.js (pm2 start & stop)

Do not rely on req object, e.g. putting mongo, redis, etc. objects in req as you may also need them in websockets

# DEPLOYMENT ON CLOUD (OPTIONAL)

## Generate Self-Signed SSL keys

- https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
- https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
- https://www.caffeinecoding.com/create-self-signed-certificate-https/

### in 1 line (works)
```
openssl req -x509 -sha256 -newkey rsa:2048 -keyout privkey.pem -out fullchain.pem -days 3650 -nodes -subj "/C=SG/ST=Singapore/L=Singapore/O=My Group/OU=My Unit/CN=127.0.0.1"
```

### in 2 lines, why?
```
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem
```

## Generate SSL Keys using Certbot

https://certbot.eff.org/


```
$ sudo apt-get update
$ sudo apt-get install -y software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install certbot 
```


https://certbot.eff.org/docs/using.html#renewing-certificates

sudo service apache2 stop
-- sudo certbot certonly --standalone -d <subdomain>.example.com
sudo certbot certonly --standalone --preferred-challenges http -d <domain>
sudo service apache2 start

### Test Renewal
sudo certbot renew --dry-run --pre-hook "sudo service apache2 stop" --post-hook "sudo service apache2 start"

### Live Renewal in crontab
sudo certbot renew --pre-hook "sudo service apache2 stop" --post-hook "sudo service apache2 start"

### so you can read renewed certs
sudo su
chmod +rx /etc/letsencrypt/live
chmod +rx /etc/letsencrypt/archive


## Using port below 1024

### PM2

https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps

> this one we did not use

http://pm2.keymetrics.io/docs/usage/specifics/#listening-on-port-80-w-o-root

sudo apt-get install authbind
sudo touch /etc/authbind/byport/443
sudo chown ubuntu /etc/authbind/byport/443
sudo chmod 755 /etc/authbind/byport/443

~/.bashrc
alias pm2='authbind --deep pm2'

source ~/.bashrc

**package.json**
"production-start": "ssh -i ../../test.pem ubuntu@127.0.0.1 \"cd ~/api; authbind --deep pm2 start --only api --env production;\"",
"production-stop": "ssh -i ../../test.pem ubuntu@127.0.0.1 \"cd ~/api; pm2 delete api;\"",


### Nodemon

sudo nodemon index.js