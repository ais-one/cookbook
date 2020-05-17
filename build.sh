#!/bin/bash

# $0. The name of script itself.
# $$ Process id of current shell.
# $* Values of all the arguments. ...
# $# Total number of arguments passed to script.
# $@ Values of all the arguments.
# $? Exit status id of last command.

if [ ! $1 ]
then
    echo "Usage npm run build -- [app folder]"
    exit
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

# build the backend
cd $1 && ./build-app.sh $baseDir/build/$1 && cd $baseDir

# build the frontend
cd $1 && ./build-web.sh $baseDir/build/$1 && cd $baseDir


# ls -A "$1" | grep -v "node_modules" | grep -v "web"
# for f in `ls -A "$1" | grep -v "node_modules" | grep -v "web"`; do
#   cp -r $1/$f build
# done

# # install npm
# cd $baseDir
# npm i
# cd $baseDir/$1
# npm i

# deploy to server?

echo "Done... press enter to exit"
read # pause exit in windows
exit 0

PEM=./$1/id_rsa
echo $PEM

# URL=ubuntu@127.0.0.1
URL=ubuntu@3.1.138.164
# root@128.199.139.34

# echo $PEM $URL
# echo --- $PEM $URL --- $1 $2

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
      cd "${packagePath}/$1/web/spa"
      npm run build
      # tar -zcvf deploy-www.tgz dist
      # scp -i $PEM deploy-www.tgz $URL:~ && rm deploy-www.tgz
      # ssh -i $PEM $URL "tar -zxvf deploy-www.tgz -C ~/app;rm deploy-www.tgz"
      # cd "$packagePath/deploy"
      ;;
    "be")
      echo "Deploy Back End... take note public and upload folders"
      tar \
        --exclude=".git" \
        --exclude="node_modules" \
        --exclude="${packagePath}/$1/.git" \
        --exclude="${packagePath}/$1/node_modules" \
        --exclude="${packagePath}/$1/deploy" \
        --exclude="${packagePath}/$1/coverage" \
        --exclude="${packagePath}/$1/tests" \
        --exclude="${packagePath}/$1/web" \
        -zcvf deploy-app.tgz .
      # scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      # ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      # cd $packagePath/deploy
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

echo "Done... press enter to exit"
read # pause exit in windows

