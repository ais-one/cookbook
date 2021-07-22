# Docker

## Backend Application

Reference - https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

From vue-crud-x folder (replace **ais-one/node-web-app** with your own image name)

```Dockerfile
# build the container
docker build -t ais-one/node-web-app:latest -f js-node/expressjs/Dockerfile . 

## NOT USED: docker run -it -d ais-one/node-web-app /bin/bash
# run the container
docker run -p 3000:3000 -p 3001:3001 -d ais-one/node-web-app

# check running container id
docker ps

# to check logs
docker logs <container id>
```

To access container command line

```bash
docker exec -it <container id> /bin/bash

# Example should be Running on http://localhost:3000
```

```bash
# to save an image
docker save image:tag | gzip > image-tag.tar.gz

# TBD load an image from tar.gz
```


## Docker Commands
```bash
docker ps
docker container ls -a
docker container rm <contianer>
docker container run <contianer>
docker container stop <contianer>
docker container start <contianer>
docker container port
docker container prune
docker image ls
docker image rm <image>

# build with
docker build -t <your username>/node-web-app:latest .
# OR
docker build -t node-web-app:latest .

# make container and run the image
docker run -p 49160:8080 -d <your username>/node-web-app


docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```
