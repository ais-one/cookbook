#!/bin/bash
# number of arguments... $#
echo "Git push across multiple projects - A script to save time"
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
    *) echo "invalid option $opt";;
  esac
done

echo

PS3="Please enter your choice: "
options2=("Diff" "Pull" "Push")
select opt2 in "${options2[@]}"
do
  case $opt2 in
    "Diff")
      echo "Do git diff"
      break
      ;;
    "Pull")
      echo "Do git pull"
      break
      ;;
    "Push")
      echo "Do git push"
      break
      ;;
    *) echo "invalid option $opt2";;
  esac
done

declare -a PACKAGES=(
  "cookbook"
  "jscommon"
  "express-template"
  "vue-antd-template"
)

BASEPATH=`cd .. && pwd`
# BASEPATH=`pwd`

# TO IMPROVE GET CHOICE TO CHOOSE INDIVIDUALLY OR DO FOR ALL
echo "Running pushes..."
echo

for package in "${PACKAGES[@]}"
do
  DOIT="Y"
  packagePath="${BASEPATH}/${package}"

  if [ "$opt" == "Confirm Single" ]; then
    echo -n "Run for... ${package} (y/n)? "
    read DOIT
  fi

  if [ "$DOIT" != "${DOIT#[Yy]}" ]; then
    # or do whatever with individual element of the array
    echo "Running for... ${package}"
    cd $packagePath

    if [ "$opt2" == "Diff" ]; then
      echo `git diff`
    elif [ "$opt2" == "Push" ]; then
      echo `git add .`
      echo `git commit -m "update"`
      if [ "$package" == "cookbook" ]; then
        echo "Push for cookbook project manually"
      else
        echo `git push origin main`
      fi
    elif [ "$opt2" == "Pull" ]; then
      if [ "$package" == "cookbook" ]; then
        echo "Push for cookbook project manually"
      else
        echo `git pull origin main`
      fi
    fi
  else
    echo "Skipped... ${packagePath}"
  fi
done

# echo checking app

echo done...

read
