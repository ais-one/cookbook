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

echo Deploying To Google Cloud Run $1

# OIFS=$IFS; IFS=","; sites=("site 1,site b,site aaa"); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

GCP_PROJECT_ID=`grep GCP_PROJECT_ID config/secret/$1.deploy | cut -d '=' -f2`
APP_NAME=example-app
# deploy to cloud run etc...
# get current timestamp...
gcloud auth activate-service-account --key-file=config/secret/$1.gcp.json
gcloud config set project $GCP_PROJECT_ID
gcloud auth configure-docker
docker build -t gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:latest --build-arg ARG_NODE_ENV=$1 --build-arg ARG_API_PORT=3000 .
docker push gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:latest
gcloud run deploy $APP_NAME-$1-svc --image gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:latest --platform managed --region asia-east1 --allow-unauthenticated --port=3000
# gcloud run services delete $APP_NAME-$1-svc --platform managed --region asia-east1
# gcloud container images delete gcr.io/cloudrun/helloworld

echo "Done... press enter to exit"
read # pause exit in windows

# # CircleCI TBD - [![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)
