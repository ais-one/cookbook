#!/bin/bash
# number of arguments... $#
echo "Maintain npm packages across multiple projects - A script to save time"
echo "supported commands: npm outdated, npm update, npm i [options] [package], npm r [package]"
echo "IF RUNNING ON WINDOWS PLEASE ENSURE YOU INTEGRATE GIT BASH TO CMD SHELL WHEN INSTALLING GIT ON WINDOWS"
echo

PS3="Please enter your choice: "
options=("Confirm All" "Confirm Single" "Quit")
select opt in "${options[@]}"
do
  case $opt in
    "Confirm Single")
      echo "Confirm files individually"
      break
      ;;
    "Confirm All")
      echo "Confirm all files"
      break
      ;;
    "Quit")
      exit 0
      ;;
    *) echo "invalid option $REPLY";;
  esac
done

echo

declare -a PACKAGES=(
  "/cookbook"
  "/jscommon"
  "/express-template"
  "/express-template/apps"
  "/vue-antd-template"
  "/vue-antd-template/src/apps"
)

BASEPATH=`cd .. && pwd`
# BASEPATH=`pwd`

# TO IMPROVE GET CHOICE TO CHOOSE INDIVIDUALLY OR DO FOR ALL
echo "Running npm ${*}..."
echo

for package in "${PACKAGES[@]}"
do
  DOIT="Y"
  packagePath="${BASEPATH}${package}"

  if [ "$opt" == "Confirm Single" ]; then
    echo -n "Run for ${packagePath} (y/n)? "
    read DOIT
  fi

  if [ "$DOIT" != "${DOIT#[Yy]}" ]; then
  # or do whatever with individual element of the array
    echo "Running for... ${packagePath}"
    cd $packagePath
    if [ "$*" == "update" ]; then
      echo `npm $* --save`
    else
      echo `npm $*`
    fi
  else
    echo "Skipped... ${packagePath}"
  fi
done

# echo checking app

echo done...

read
