# npm run deploy -- --port=1337
#!/bin/bash
PEM=../deploy/id_rsa
URL=user@127.0.0.1

# cd app
# tar --exclude="node_modules,coverage,example-app/tests" -zcvf deploy-app.tgz .
# scp -i $PEM deploy-app.tgz $URL:~ && rm deploy-app.tgz
# ssh -i $PEM $URL "tar -zxvf deploy-app.tgz -C ~/app;rm deploy-app.tgz"

echo $PEM $URL
echo ---
echo $1 $2

if [ "$2" == "fe" ]; then
    echo "Front End"
elif [ "$2" == "be" ]; then
    echo "Deploy Back End"
else
    echo "Command not found be, fe, list, start, stop"
fi

# $2 be, fe, list, start, stop

read # pause exit in windows
