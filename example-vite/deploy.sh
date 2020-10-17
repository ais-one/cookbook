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

echo Deploying To Google Storage $1

GS=gs://$1.mybot.live

echo "build and deploy ($1)"
# CANNOT because need vite to build  npm ci --only=production
# npm install && npm cache clean --force
npm install
# npm run vite build --mode $1 # Cannot work - cannot find vite
npm run build-$1

if [ "$CI" = "true" ]; then
  echo "CI configured gcloud auth"
  gsutil -m rm $GS/**
  gsutil -m rsync -R dist $GS
else
  GCP_PROJECT_ID=mybot-live
  gcloud auth activate-service-account --key-file=deploy/$1.gcp.json
  gcloud config set project $GCP_PROJECT_ID
  echo "NOTE: gsutil.cmd in windows git bash. If cannot find command in Windows, it could be space in path (.../Google Cloud/...) to gsutil."
  echo "Fix by renaming with no space, also edit the PATH env, restart the command console."
  gsutil.cmd -m rm $GS/**
  gsutil.cmd -m rsync -R dist $GS
fi

echo "Done..."

# Echo "clear cloudflare cache"
# # Sample command to clear cloudflare cache 
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" -H "Content-Type: application/json" --data '{"purge_everything":true}'

if [ "$CI" != "true" ]; then
  echo "press enter key to exit"
  read # pause exit in windows
fi
