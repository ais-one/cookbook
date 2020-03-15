https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

from vue-crud-x folder

```
docker build -t ais-one/node-web-app -f example-app/Dockerfile . 
```

```
docker run -p 3000:3000 -p 3001:3001 -d ais-one/node-web-app
```

```
docker run -it -d ais-one/node-web-app /bin/bash
```

```
$ docker ps
```

```
$ docker logs <container id>
```

# Example
Running on http://localhost:8080

$ docker exec -it <container id> /bin/bash

docker container ls -a
docker container rm <contianer>
docker container run <contianer>
docker container stop <contianer>
docker container start <contianer>
docker container port


