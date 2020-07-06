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
if [ ! $3 ]; then # eg. example-web
    echo "Missing path to web. Set at package.json" && read && exit
fi

# OIFS=$IFS; IFS=","; sites=("site 1,site b,site aaa"); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

baseDir=`pwd`

PEM=./$1/config/secret/$2.pem
read URL < $1/config/secret/$2.url

# deploy to cloud run etc...
# get current timestamp...
# gcloud auth activate-service-account --key-file=$1/config/secret/$2.gcp.json
# gcloud config set project mybot-live
# gcloud auth configure-docker
# docker build -t gcr.io/[PROJECT_ID]/[your-app-name]:latest .
# docker push gcr.io/[PROJECT_ID]/[your-app-name]:latest
# gcloud run deploy vcx-app-service --image gcr.io/mybot-live/vcx-app:latest --platform managed --region asia-east1 --allow-unauthenticated --port=3000

# gcloud container images delete gcr.io/cloudrun/helloworld
# gcloud run services delete helloworld --platform managed --region asia-east1


PS3="Please enter your choice: "
options=(
  "ssh"
  "deploy-api"
  "deploy-fe"
  "list" "start" "stop"
  "quit"
)
select opt in "${options[@]}"
do
  case $opt in
    "ssh") ssh -i $PEM $URL -L 27000:127.0.0.1:27017 ;; # allow connection to mongodb via port 27000
    "deploy-api")
      echo "Deploy Back End... take note public and upload folders"
      tar -zcvf deploy-app.tgz \
        --exclude=common-lib/webpacked/node_modules --exclude=$1/node_modules \
        common-lib $1/ package.json
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      read -p "Install Packages (y/n)?" yn < /dev/tty
      if [[ $yn == "Y" || $yn == "y" ]]; then
        echo "Installing packages"
        ssh -i $PEM $URL "cd ~/app;npm i;cd $1;npm i"
      fi
      ;;
    "deploy-fe")
      echo "NOTE: gsutil.cmd in windows git bash. If cannot find command in Windows, it could be space in path (.../Google Cloud/...) to gsutil."
      echo "Fix by renaming with no space, also edit the PATH env, restart the command console."
      gcloud auth activate-service-account --key-file=$1/config/secret/$2.gcp.json
      baseDir=`pwd`
      OIFS=$IFS;
      while IFS=, read -r site gs; do
        # build
        cd $3/$site
        read -p "build and deploy - site $3/$site ($2) (y/n)?" yn < /dev/tty
        if [[ $yn == "Y" || $yn == "y" ]]; then
          npm run build-$2
          gsutil.cmd -m rsync -R dist $gs
        fi
        # mkdir -p $baseDir/build/$1/$site/dist
        # cp -r $site/dist $baseDir/build/$1/$site
        echo "Site built"
        cd $baseDir
      done < $1/config/secret/$2.web.csv
      IFS=$OIFS
      cd $baseDir
# clear cloudflare cache
# cat <<-EOF
# # Sample command to clear cloudflare cache 
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" \
#   -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" \
#   -H "Content-Type: application/json" --data '{"purge_everything":true}'
# # CircleCI TBD - [![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)
# EOF
      ;;
    "list") ssh -i $PEM $URL "pm2 list" ;;
    "start") ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start $1/ecosystem.config.js --env $2;" ;;
    "stop") ssh -i $PEM $URL "cd ~/app; pm2 stop $1/ecosystem.config.js;" ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt" ;;
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
