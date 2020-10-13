#!/bin/bash
# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

if [ ! $1 ]; then # environment eg. uat
    echo "Missing project environment. Set at package.json" && read && exit
fi

echo Deploying $1

# OIFS=$IFS; IFS=","; sites=("site 1,site b,site aaa"); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

baseDir=`pwd`

PEM=./deploy/$1.pem
URL=ubuntu@3.1.138.164

# echo $URL $PEM

PS3="Please enter your choice: "
options=(
  "ssh" "list" "start" "stop" "deploy" "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "ssh") ssh -i $PEM $URL -L 27000:127.0.0.1:27017 ;; # allow connection to mongodb via port 27000
    "list") ssh -i $PEM $URL "pm2 list" ;;
    "start") ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start ecosystem.config.js --env $1;" ;;
    "stop") ssh -i $PEM $URL "cd ~/app; pm2 stop ecosystem.config.js;" ;;
    "deploy")
      echo "Deploy Back End to VM... take note public and upload folders"
      tar -zcvf deploy-app.tgz --exclude=node_modules .
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      read -p "Install Packages (y/n)?" yn < /dev/tty
      if [[ $yn == "Y" || $yn == "y" ]]; then
        echo "Installing packages"
        ssh -i $PEM $URL "cd ~/app;npm i"
      fi
      echo "Restart"
      ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start ecosystem.config.js --env $1;"
      ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt" ;;
  esac
done

echo "Done... press enter to exit"
read # pause exit in windows
