#!/bin/bash

# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

# $1 relative path to project folder from vue-crud-x
# $2 environment

echo "IMPORTANT! Run this in the vue-crud-x folder"

if [ ! $1 ]; then # eg. example-app
    echo "Missing path to project. Set at package.json" && read && exit
fi
if [ ! $2 ]; then # eg. uat
    echo "Missing project environment. Set at package.json" && read && exit
fi

# OIFS=$IFS; IFS=","; sites=($3); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

baseDir=`pwd`

PEM=./$1/config/secret/$2.pem
read URL < $1/config/secret/$2.url

PS3="Please enter your choice: "
options=(
  "ssh"
  "deploy-api"
  "list" "start" "stop"
  "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "ssh")
      ssh -i $PEM $URL -L 27000:127.0.0.1:27017 # allow connection to mongodb via port 27000
      ;;
    "deploy-api")
      echo "Deploy Back End... take note public and upload folders"
      tar -zcvf deploy-app.tgz \
        --exclude=node_modules \
        --exclude=common-lib/webpacked/node_modules \
        --exclude=$1/node_modules \
        common-lib $1/ package.json
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      read -p "Install Packages (y/n)?" yn < /dev/tty
      if [[ $yn == "Y" || $yn == "y" ]]; then
        echo "Installing packages"
        ssh -i $PEM $URL "cd ~/app;npm i;cd $1;npm i"
      fi
      ;;
    "list")
      ssh -i $PEM $URL "pm2 list"
      ;;
    "start")
        # ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app,cron --env $2;"
        ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start $1/ecosystem.config.js --env $2;"
      ;;
    "stop")
        # ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
        ssh -i $PEM $URL "cd ~/app; pm2 stop $1/ecosystem.config.js;"
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

# for f in `ls -A "common-lib" | grep -v "common-web"`; do
#   cp -r common-lib/$f build/common-lib
# done
# for f in `ls -A | grep -v "node_modules" | grep -v "web" | grep -v ".git"`; do
#   cp -r $f $baseDir/build/$1
# done
