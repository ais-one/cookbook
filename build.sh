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

if [ ! $1 ]; then
    echo "Missing path to project. Set at package.json" && read && exit
fi
if [ ! $2 ]; then
    echo "Missing project environment. Set at package.json" && read && exit
fi

baseDir=`pwd`

# cleanup build directory
rm -rf build
mkdir -p build build/common-web build/$1

# copy the base
cp -r common common-app app.js appname.js index.js package.json build
for f in `ls -A "common-web" | grep -v "node_modules" | grep -v "dist"`; do
  cp -r common-web/$f build/common-web
done

echo "building  - backend ($2) to $baseDir/build/$1" # build the backend
cd $1
# copy to build folder
for f in `ls -A | grep -v "node_modules" | grep -v "web" | grep -v ".git"`; do
  cp -r $f $baseDir/build/$1
done
cd $baseDir
echo "done"


cd $1
OIFS=$IFS;
while IFS=, read -r site gs; do
  cd $site
  echo "building - site $site ($2)"
  read -p "install packages (y/n)?" yn < /dev/tty
  if [[ $yn == "Y" || $yn == "y" ]]; then
    npm i
  fi
  read -p "build (y/n)?" yn < /dev/tty
  if [[ $yn == "Y" || $yn == "y" ]]; then
    npm run build-$2
  fi
  cd ../..
  mkdir -p $baseDir/build/$1/$site/dist
  cp -r $site/dist $baseDir/build/$1/$site
  echo "Site copied to $baseDir/build/$1"
done < config/web.csv
IFS=$OIFS
cd $baseDir

mv $baseDir/build/$1/ecosystem.config.js $baseDir/build # move the ecosystem.config.js file - for PM2

# Dockerfile... TBD docker and kubernetes deployments

# node modules to be deployed on server

# cd $baseDir && npm i && cd $baseDir/$1 && npm i

echo "Done... press enter to exit"
read # pause exit in windows
exit 0
