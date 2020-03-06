#!/bin/bash

PEM=./id_rsa
# URL=ubuntu@127.0.0.1
URL=ubuntu@3.1.138.164
# root@128.199.139.34

# echo $PEM $URL
# echo --- $PEM $URL --- $1 $2

packagePath=`cd .. && pwd`
echo $packagePath
# exit

PS3="Please enter your choice: "
options=(
  "ssh"
  "fe"
  "be"
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
    "fe")
      echo "Deploy Front End"
      cd "${packagePath}/web/spa"
      npm run build
      # tar -zcvf deploy-www.tgz dist
      # scp -i $PEM deploy-www.tgz $URL:~ && rm deploy-www.tgz
      # ssh -i $PEM $URL "tar -zxvf deploy-www.tgz -C ~/app;rm deploy-www.tgz"
      cd "$packagePath/deploy"
      ;;
    "be")
      echo "Deploy Back End"
      cd "${packagePath}/.."
      tar \
        --exclude="node_modules" \
        --exclude="${packagePath}/deploy" \
        --exclude="${packagePath}/coverage" \
        --exclude="${packagePath}/tests" \
        --exclude="${packagePath}/web" \
        -zcvf deploy-app.tgz .
      # scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      # ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      cd $packagePath/deploy
      ;;
    "list")
      ssh -i $PEM $URL "pm2 list"
      ;;
    # "start")
    #   ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app,cron --env production;"
    #   ;;
    # "stop")
    #   ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
    #   ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt";;
  esac
done

# echo "Done... press enter to exit"
# read # pause exit in windows

