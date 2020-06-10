#!/bin/bash

# This is meant to be copied into the build folder...

# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

# $1 relative path to project folder from vue-crud-x
# $2 environment

echo "IMPORTANT! Run this in the vue-crud-x/build folder"

if [ ! $1 ] # eg. example-app
then
    echo "Missing path to project. Set at package.json" && read && exit
fi
if [ ! $2 ] # eg. uat
then
    echo "Missing project environment. Set at package.json" && read && exit
fi

# OIFS=$IFS; IFS=","; sites=($3); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

# build and install frontend?
baseDir=`pwd`

PEM=
URL=
if [ $2 == "uat" ]; then
  PEM=./$1/config/uat.pem
  read URL < $1/config/uat.url # ubuntu@35.187.243.253
fi

PS3="Please enter your choice: "
options=(
  "ssh"
  "build-fe" "deploy-api" "deploy-fe"
  "list" "start" "stop"
  "install"
  "clear-cloud-flare-cache"
  "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "ssh")
      ssh -i $PEM $URL -L 27000:127.0.0.1:27017 # allow connection to mongodb via port 27000
      ;;
    "build-fe")
      cd $1
      OIFS=$IFS;
      while IFS=, read -r site gs; do
        webBaseDir=`pwd`
        cd $site
        echo "building - site $site ($2)"
        read -p "install packages (y/n)?" yn < /dev/tty
        if [[ $yn == "Y" || $yn == "y" ]]; then
          npm i
        fi
        read -p "build (y/n)?" yn < /dev/tty
        if [[ $yn == "Y" || $yn == "y" ]]; then
          npm run build-$2
        fi
        cd $webBaseDir
        # mkdir -p $baseDir/build/$1/$site/dist
        # cp -r $site/dist $baseDir/build/$1/$site
        echo "Site built"
      done < config/$2.web.csv
      IFS=$OIFS
      cd $baseDir
      ;;
    "deploy-fe")
      echo "gsutil.cmd in windows git bash"
      echo "If cannot find command in Windows, it could be space in path (.../Google Cloud/...) to gsutil."
      echo "Fix by renaming with no space, also edit the PATH env, restart the command console."
      OIFS=$IFS;
      while IFS=, read -r site gs; do
        read -p "deploy gs $site (y/n)?" yn < /dev/tty
        if [[ $yn == "Y" || $yn == "y" ]]; then
          gsutil.cmd -m rsync -R $1/$site/dist $gs
        fi
      done < $1/config/$2.web.csv
      IFS=$OIFS
      # cd build
      # gsutil.cmd rsync -R $1/web/spa/dist gs://uat.viow.co
      # cd ..
      ;;
    "deploy-api")
      echo "Deploy Back End... take note public and upload folders"
      # cd build
      # tar -zcvf deploy-app.tgz .
      # scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      # ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      # cd ..
      ## V2
      tar -zcvf deploy-app.tgz --exclude=common-app/common-webpack/node_modules --exclude=node_modules --exclude=$1/node_modules --exclude=$1/web common-app/ --exclude=$1/.git $1/ package.json
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      ;;
    "install")
      echo "Install packages"
      ssh -i $PEM $URL "cd ~/app;npm i;cd $1;npm i"
      ;;
    "list")
      ssh -i $PEM $URL "pm2 list"
      ;;
    "start")
        # ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app,cron --env $2;"
        # ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start ecosystem.config.js --env $2;"
        ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start $1/ecosystem.config.js --env $2;"
      ;;
    "stop")
        # ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
        # ssh -i $PEM $URL "cd ~/app; pm2 stop ecosystem.config.js;"
        ssh -i $PEM $URL "cd ~/app; pm2 stop $1/ecosystem.config.js;"
      ;;
    "clear-cloud-flare-cache")
cat <<-EOF
# Sample command to clear cloudflare cache 
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" \
  -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" \
  -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
# CircleCI TBD - [![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)
EOF
        ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt";;
  esac
done

echo "Done... press enter to exit"
read # pause exit in windows

# for f in `ls -A "common-app" | grep -v "common-web"`; do
#   cp -r common-app/$f build/common-app
# done
# for f in `ls -A | grep -v "node_modules" | grep -v "web" | grep -v ".git"`; do
#   cp -r $f $baseDir/build/$1
# done
