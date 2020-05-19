#!/bin/bash
echo "building $1 - backend in $2"

# get the base directory
# echo $1

# copy to build folder
for f in `ls -A | grep -v "node_modules" | grep -v "web" | grep -v ".git"`; do
  # echo $f
  cp -r $f $1
done

echo "done"
