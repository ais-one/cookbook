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

if [ ! $1 ]
then
    echo "Missing path to project. Set at package.json"
    exit
fi
if [ ! $2 ]
then
    echo "Missing project environment. Set at package.json"
    exit
fi

# build and install frontend?
baseDir=`pwd`

PEM=
URL=
if [ $2 == "uat" ]; then
  PEM=./$1/config/uat.pem
  URL=ubuntu@34.87.160.194
fi

PS3="Please enter your choice: "
options=(
  "ssh"
  "deploy"
  "install"
  "list"
  "start"
  "stop"
  "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "ssh")
      ssh -i $PEM $URL -L 27000:127.0.0.1:27017
      # ssh $URL -L 27000:127.0.0.1:27017
      ;;
    "deploy")
      echo "Deploy Back End... take note public and upload folders"
      tar -zcvf deploy-app.tgz .
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      # cd $packagePath/deploy
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
        ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app --env $2;"
      ;;
    "stop")
        # ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
        ssh -i $PEM $URL "cd ~/app; pm2 delete app;"
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
