# npm run deploy -- --port=1337
#!/bin/bash
PEM=../deploy/id_rsa
# URL=ubuntu@127.0.0.1
URL=root@128.199.139.34

# echo $PEM $URL
# echo --- $PEM $URL --- $1 $2
# ACTION=$2

echo "Type in one of the actions below and press enter"
echo "ssh = connect via ssh"
echo "be = deploy backend"
echo "fe = build and deploy frontend"
echo "list = list daemons"
echo "start = start daemons"
echo "stop = stop daemons"
read ACTION


# ssh -i $PEM $URL -L 27000:127.0.0.1:27017
if [ "$ACTION" == "ssh" ]; then
    ssh $URL -L 27000:127.0.0.1:27017
# deploy frontend
elif [ "$ACTION" == "fe" ]; then
    echo "Deploy Front End"
    cd ~/web/example-spa
    npm run build
    tar -zcvf deploy-www.tgz dist
    scp -i $PEM deploy-www.tgz $URL:~ && rm deploy-www.tgz
    ssh -i $PEM $URL "tar -zxvf deploy-www.tgz -C ~/app;rm deploy-www.tgz"
# deploy backend
elif [ "$ACTION" == "be" ]; then
    echo "Deploy Back End"
    cd ~/app
    tar --exclude="node_modules,coverage,example-app/tests" -zcvf deploy-app.tgz .
    scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
    ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
# pm2 stuff
elif [ "$ACTION" == "list" ]; then
    ssh -i $PEM $URL "pm2 list"
elif [ "$ACTION" == "start" ]; then
    ssh -i $PEM $URL "cd ~/app; authbind --deep pm2 start --only app,cron --env production;"
elif [ "$ACTION" == "stop" ]; then
    ssh -i $PEM $URL "cd ~/app; pm2 delete app cron;"
# fallback
else
    echo "Action not found"
fi

echo "Done... press enter to exit"
read # pause exit in windows
