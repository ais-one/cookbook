#!/bin/bash
# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

if [ ! $1 ]; then # environment eg. uat
    echo "Missing project environment. Set at package.json. Press any key to continue..." && read && exit
fi

if [ "$1" = "development" ]; then
    echo "Cannot deploy using development environment. Press any key to continue..." && read && exit
fi

GCP_PROJECT_ID=mybot-live
SITE=vite
GS=gs://$1.mybot.live

echo "NOTE: gsutil.cmd in windows git bash. If cannot find command in Windows, it could be space in path (.../Google Cloud/...) to gsutil."
echo "Fix by renaming with no space, also edit the PATH env, restart the command console."
gcloud auth activate-service-account --key-file=secrets/$1.gcp.json
gcloud config set project $GCP_PROJECT_ID

echo "build and deploy - site $SITE ($1)"
npm run build-$1
gsutil.cmd -m rsync -R dist $GS
echo "done. press any key to continue"

# Echo "clear cloudflare cache"
# # Sample command to clear cloudflare cache 
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" -H "Content-Type: application/json" --data '{"purge_everything":true}'
read # pause exit in windows

# # CircleCI TBD - [![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)
