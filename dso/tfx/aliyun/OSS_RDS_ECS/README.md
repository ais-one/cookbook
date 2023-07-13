LTAI5t9QkJm4787dDaKp4P3g
pui6CH99pBk45UuG0JAhTp2iVGUlcO


https://registry.terraform.io/providers/aliyun/alicloud/latest/docs

eip_ecs = "47.89.250.90" root / Aliyun-test
rds_pg_url = "pgm-2evl41lg2306fc1q168220.pg.rds.aliyuncs.com"
redis_url = "r-2evc85be6a482fb4.redis.rds.aliyuncs.com"

wget https://labex-ali-data.oss-us-west-1.aliyuncs.com/games/atlas_of_thrones.sql
apt update && apt -y install postgresql-client
psql -h pgm-2evl41lg2306fc1q168220.pg.rds.aliyuncs.com -p 5432 -U patrick -d atlas_of_thrones
 the_best_passsword

 CREATE EXTENSION postgis;
 \q
 psql -h pgm-2evl41lg2306fc1q168220.pg.rds.aliyuncs.com -p 5432 -U patrick -d atlas_of_thrones < atlas_of_thrones.sql

 \dt
 \d <tablename>
 SELECT name, claimedby, gid FROM kingdoms;
 \q

 wget http://labex-ali-data.oss-us-west-1.aliyuncs.com/nodejs/node-v12.13.0-linux-x64.tar.xz
 tar -xf node-v12.13.0-linux-x64.tar.xz
 mv node-v12.13.0-linux-x64 /usr/local/node

/etc/profile
export NODE_HOME=/usr/local/node
export PATH=$PATH:$NODE_HOME/bin

source /etc/profile
node -v
npm -v
apt -y install git
git clone -b labex https://github.com/andi1991/Atlas-Of-Thrones.git
cd Atlas-Of-Thrones
nano .env


.env
PORT=5000
DATABASE_URL=postgres://patrick:the_best_passsword@pgm-2evl41lg2306fc1q168220.pg.rds.aliyuncs.com:5432/atlas_of_thrones?ssl=false
REDIS_HOST=r-2evc85be6a482fb4.redis.rds.aliyuncs.com
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:8080

npm install
npm cache clean --force
npm i --unsafe-perm node-sass@4.14.1

http://47.89.250.90:8080/


