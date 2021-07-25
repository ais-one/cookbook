#!/bin/bash

# THIS SCRIPT DOES NOT WORK - IT IS JUST A SAMPLE FOR LEARNING BASH COMMANDS

# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

echo "SAMPLE SHELL SCRIPT"

if [ ! $1 ]; then # environment eg. uat
    echo "Missing project environment. Set at package.json" && read && exit
fi
if [ ! $2 ]; then # path to backend eg. js-node/expressjs
    echo "Missing path to project. Set at package.json" && read && exit
fi
if [ ! $3 ]; then # path to frontends eg. example-web
    echo "Missing path to web. Set at package.json" && read && exit
fi

# OIFS=$IFS; IFS=","; sites=("site 1,site b,site aaa"); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

baseDir=`pwd`

# sample .deploy file contents
# URL=ubuntu@35.187.243.253
# WEB=spa1,gs://uat.mybot.live;admin,gs://admin.mybot.live
# GCP_PROJECT_ID=mybot-live

PEM=./$2/config/secret/$1.pem
URL=`grep URL $2/config/secret/$1.deploy | cut -d '=' -f2`
WEB=`grep WEB $2/config/secret/$1.deploy | cut -d '=' -f2`
GCP_PROJECT_ID=`grep GCP_PROJECT_ID $2/config/secret/$1.deploy | cut -d '=' -f2`


# choose action
PS3="Please enter your choice: "
options=(
  "uat-ssh"
  "uat-list" "uat-start" "uat-stop"
  "uat-deploy-vm"
  "prod-deploy-cr"
  "deploy-fe"
  "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "uat-ssh") ssh -i $PEM $URL -L 27000:127.0.0.1:27017 ;; # allow connection to mongodb via port 27000
    "prod-deploy-cr")
      echo "Deploy Back End to GCP Cloud Run"
      # deploy to cloud run etc...
      # get current timestamp...
      gcloud auth activate-service-account --key-file=$2/config/secret/$1.gcp.json
      gcloud config set project $GCP_PROJECT_ID
      gcloud auth configure-docker

      docker build -t gcr.io/$GCP_PROJECT_ID/$2-$1:latest --build-arg ARG_APP_NAME=$2 --build-arg ARG_NODE_ENV=$1  --build-arg ARG_API_PORT=3000 .
      docker push gcr.io/$GCP_PROJECT_ID/$2-$1:latest
      gcloud run deploy $2-$1-svc --image gcr.io/$GCP_PROJECT_ID/$2-$1:latest --platform managed --region asia-east1 --allow-unauthenticated --port=3000

      # gcloud run services delete $2-$1-svc --platform managed --region asia-east1
      # gcloud container images delete gcr.io/cloudrun/helloworld
      ;;
    "uat-deploy-vm")
      echo "Deploy Back End to VM... take note public and upload folders"
      tar -zcvf deploy-app.tgz \
        --exclude=common-lib/webpacked/node_modules --exclude=$2/node_modules \
        common-lib $2/ package.json
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      read -p "Install Packages (y/n)?" yn < /dev/tty
      if [[ $yn == "Y" || $yn == "y" ]]; then
        echo "Installing packages"
        ssh -i $PEM $URL "cd ~/app;npm i;cd $2;npm i"
      fi
      echo "Restart"
      ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start $2/ecosystem.config.js --env $1;"
      ;;
    "deploy-fe")
      echo "NOTE: gsutil.cmd in windows git bash. If cannot find command in Windows, it could be space in path (.../Google Cloud/...) to gsutil."
      echo "Fix by renaming with no space, also edit the PATH env, restart the command console."
      gcloud auth activate-service-account --key-file=$2/config/secret/$1.gcp.json
      gcloud config set project $GCP_PROJECT_ID
      baseDir=`pwd`

      IFS=';' read -r -a rows <<< $WEB
      for row in "${rows[@]}"; do
          IFS=', ' read -r -a cols <<< $row
          site=${cols[0]}
          gs=${cols[1]}

          # build
          cd $3/$site
          read -p "build and deploy - site $3/$site ($1) (y/n)?" yn < /dev/tty
          if [[ $yn == "Y" || $yn == "y" ]]; then
            npm run build-$1
            gsutil.cmd -m rsync -R dist $gs
          fi
          # mkdir -p $baseDir/build/$2/$site/dist
          # cp -r $site/dist $baseDir/build/$2/$site
          echo "Site built"
          cd $baseDir
      done
      cd $baseDir
      # Echo "clear cloudflare cache"
      # # Sample command to clear cloudflare cache 
      # curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" -H "Content-Type: application/json" --data '{"purge_everything":true}'
      ;;
    "uat-list") ssh -i $PEM $URL "pm2 list" ;;
    "uat-start") ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start $2/ecosystem.config.js --env $1;" ;;
    "uat-stop") ssh -i $PEM $URL "cd ~/app; pm2 stop $2/ecosystem.config.js;" ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt" ;;
  esac
done

echo "Done... press enter to exit"
read # pause exit in windows
