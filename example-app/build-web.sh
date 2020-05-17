#!/bin/bash
# PWD=`pwd`
# echo $PWD

echo "building example-app - frontend"

cd web/spa
# npm i
# npm run build
cd ../..

mkdir -p $1/web/spa/dist
cp -r web/spa/dist $1/web/spa