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

# build and install frontend?
baseDir=`pwd`

# cleanup build directory
rm -rf build
mkdir -p build build/common-web build/$1

# copy common stuff
cp -r common common-app app.js appname.js index.js package.json build
for f in `ls -A "common-web" | grep -v "node_modules" | grep -v "dist"`; do
  # echo $f
  cp -r common-web/$f build/common-web
done

cd $1 && ./build-app.sh $baseDir/build/$1 $2 && cd $baseDir

cd $1 && ./build-web.sh $baseDir/build/$1 $2 && cd $baseDir

# build the frontend

# move the deploy.sh file
mv $baseDir/build/$1/deploy.sh $baseDir/build

# move the ecosystem.config.js file - for PM2
mv $baseDir/build/$1/ecosystem.config.js $baseDir/build

# ls -A "$1" | grep -v "node_modules" | grep -v "web"
# for f in `ls -A "$1" | grep -v "node_modules" | grep -v "web"`; do
#   cp -r $1/$f build
# done

# # install npm
# cd $baseDir
# npm i
# cd $baseDir/$1
# npm i

echo "Done... press enter to exit"
read # pause exit in windows
exit 0
