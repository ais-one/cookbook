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
options2=("Pull" "Push")
select opt2 in "${options2[@]}"
do
  case $opt2 in
    "Pull")
      echo "Confirm files individually"
      break
      ;;
    "Push")
      echo "Confirm all files"
      break
      ;;
    *) echo "invalid option $opt2";;
  esac
done

declare -a PACKAGES=(
  "udemy"
  "ahop2"
  "ms"
  "v3"
  "vue-crud-x"
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

    if [ "$opt2" == "Push" ]; then
      echo `git add .`
      echo `git commit -m "update libs"`
      if [ "$package" == "vue-crud-x" ]; then
        echo `git push origin develop`
      else
        echo `git push origin master`
      fi
    elif [ "$opt2" == "Push" ]; then
      if [ "$package" == "vue-crud-x" ]; then
        echo `git pull origin develop`
      else
        echo `git pull origin master`
      fi
    fi
  else
    echo "Skipped... ${packagePath}"
  fi
done

# echo checking app

echo done...

read
