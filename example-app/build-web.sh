#!/bin/bash
# PWD=`pwd`
# echo $PWD

echo "building example-app"

echo "frontend..."
cd web/spa
# npm i
npm run build
cd ../..
