#!/bin/bash
echo "building example-app - backend"

# get the base directory
# echo $1

# copy to build folder
for f in `ls -A | grep -v "node_modules" | grep -v "web"`; do
  # echo $f
  cp -r $f $1
done
