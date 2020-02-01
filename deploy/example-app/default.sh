# npm run deploy -- --port=1337
#!/bin/bash
PEM=../deploy/id_rsa
URL=ubuntu@127.0.0.1

# echo $PEM $URL
# echo --- $PEM $URL --- $1 $2

if [ "$2" == "ssh" ]; then
    # ssh -i $PEM $URL -L 27000:127.0.0.1:27017
    ssh $URL -L 27000:127.0.0.1:27017
elif [ "$2" == "fe" ]; then
    echo "Deploy Front End"
    cd ~/web/example-spa
    npm run build
    tar -zcvf deploy-www.tgz dist
    scp -i $PEM deploy-www.tgz $URL:~ && rm deploy-www.tgz
    ssh -i $PEM $URL "tar -zxvf deploy-www.tgz -C ~/app;rm deploy-www.tgz"
elif [ "$2" == "be" ]; then
    echo "Deploy Back End"
    cd ~/app
    tar --exclude="node_modules,coverage,example-app/tests" -zcvf deploy-app.tgz .
    scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
    ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"
elif [ "$2" == "list" ]; then
    ssh -i $PEM $URL "pm2 list"
elif [ "$2" == "start" ]; then
    ssh -i $PEM $URL "cd ~/api; authbind --deep pm2 start --only api --env production;"
elif [ "$2" == "stop" ]; then
    ssh -i $PEM $URL "cd ~/api; pm2 delete api;"
else
    echo "Command not found"
    echo "npm run deploy ssh = connect via ssh"
    echo "npm run deploy be = deploy backend"
    echo "npm run deploy fe = build and deploy frontend"
    echo "npm run deploy list = list daemons"
    echo "npm run deploy start = start daemons"
    echo "npm run deploy stop = stop daemons"
fi

read # pause exit in windows
