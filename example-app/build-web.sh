#!/bin/bash
# PWD=`pwd`
# echo $PWD

echo "building $1 - frontend in $2"

cd web/spa

read -p "install packages (y/n)?" yn
if [[ $yn == "Y" || $yn == "y" ]]; then
  npm i
fi

read -p "build $2 (y/n)?" yn
if [[ $yn == "Y" || $yn == "y" ]]; then
  npm run build-$2
fi

cd ../..

mkdir -p $1/web/spa/dist
cp -r web/spa/dist $1/web/spa

echo "done"
