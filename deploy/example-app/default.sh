# npm run deploy -- --port=1337
#!/bin/bash
PEM=./id_rsa
# URL=ubuntu@127.0.0.1
URL=root@128.199.139.34

# echo $PEM $URL
# echo --- $PEM $URL --- $1 $2

packagePath="../../web/${1}"
echo $packagePath

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
      # ssh -i $PEM $URL -L 27000:127.0.0.1:27017
      ssh $URL -L 27000:127.0.0.1:27017
      ;;
    "fe")
      echo "Deploy Front End"
      cd ~/web/example-spa
      npm run build
      tar -zcvf deploy-www.tgz dist
      scp -i $PEM deploy-www.tgz $URL:~ && rm deploy-www.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-www.tgz -C ~/app;rm deploy-www.tgz"
      ;;
    "be")
      echo "Deploy Back End"
      cd ~/app
      tar --exclude="node_modules,coverage,example-app/tests" -zcvf deploy-app.tgz .
      scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
      ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
      ;;
    "list")
      ssh -i $PEM $URL "pm2 list"
      ;;
    "start")
      ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app,cron --env production;"
      ;;
    "stop")
      ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
      ;;
    "quit")
      echo "QUIT"
      break
      ;;
    *) echo "Invalid option $opt";;
  esac
done

# if [ "$ACTION" == "ssh" ]; then
#   echo "$ACTION"
# elif [ "$ACTION" == "fe" ]; then
#   echo "$ACTION"
# elif [ "$ACTION" == "be" ]; then
#   echo "$ACTION"
# elif [ "$ACTION" == "list" ]; then
#   echo "$ACTION"
# elif [ "$ACTION" == "start" ]; then
#   echo "$ACTION"
# elif [ "$ACTION" == "stop" ]; then
#   echo "$ACTION"
# else
#     echo "Action not found"
# fi

echo "Done... press enter to exit"
read # pause exit in windows
