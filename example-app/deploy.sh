#!/bin/bash
# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

echo "CI? [$CI]"

if [ ! $1 ]; then # environment eg. uat
  echo "Missing project environment. Set at package.json. Press any key to continue..."
  if [ "$CI" != "true" ]; then
    read
  fi
  exit
fi

if [ "$1" = "development" ]; then
  echo "Cannot deploy using development environment. Press any key to continue..."
  if [ "$CI" != "true" ]; then
    read
  fi
  exit
fi

echo Deploying To Google Cloud Run $1

# test from github secrets
echo "NPM_TOKEN $NPM_TOKEN"
echo "BLAH $BLAH"
exit

# OIFS=$IFS; IFS=","; sites=("site 1,site b,site aaa"); IFS=$OIFS
# for site in "${sites[@]}"; do
#    echo $site
# done
# read && exit

BUILD_TS=`date +"%Y%m%d%H%M"`
GCP_PROJECT_ID=mybot-live
APP_NAME=example-app

if [ "$CI" = "true" ]; then
  echo "CI deploy"
  echo "configured gcloud auth for $GCP_PROJECT_ID"
  echo "build_ts $BUILD_TS"
  # gcloud auth list
else
  echo "manual deploy"
  # test vault
  VAULT_TOKEN=
  # roottoken
  VAULT_URL=http://127.0.0.1:8200/v1/secret/data/test?version=1
  gcloud auth activate-service-account --key-file=deploy/$1.gcp.json
  gcloud config set project $GCP_PROJECT_ID
fi

# get vault data if any
if [[ ! -z $VAULT_TOKEN && ! -z $VAULT_URL ]]; then
  VAULT_RES=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_URL)
fi

# if [[ ! -z $VAULT_RES ]]; then
#   echo $VAULT_RES
# else
#   echo "Empty Vault Response"
# fi
# a test run
# cross-env NODE_ENV=development VAULT_RES=$VAULT_RES PORT=3001 DEBUG=app:* nodemon --ignore '*.test.js' --watch src bin/www

# deploy to cloud run etc...
# get current timestamp...
gcloud auth configure-docker
docker build -t gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS --build-arg ARG_NODE_ENV=$1 --build-arg ARG_API_PORT=3000 --build-arg ARG_VAULT_RES=$VAULT_RES .
docker push gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS
gcloud run deploy $APP_NAME-$1-svc --image gcr.io/$GCP_PROJECT_ID/$APP_NAME-$1:$BUILD_TS --platform managed --region asia-southeast1 --allow-unauthenticated --port=3000
# gcloud run services delete $APP_NAME-$1-svc --platform managed --region asia-east1
# gcloud container images delete gcr.io/cloudrun/helloworld

echo "Done..."

if [ "$CI" != "true" ]; then
  echo "press enter key to exit"
  read # pause exit in windows
fi
