Here is the simplest way to create a 3-node MongoDb replica set using Docker.

These instructions were created using Docker on Windows 10 and setup to use Linux containers.

Step 1: Create data volumes for each node

```bash
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local
```

Step 2: Create a file called docker-compose.yml

```yaml
version: "3"

services:
  mongo0:
    hostname: mongo0
    container_name: mongo0
    image: mongo:latest
    expose:
    - 30000
    ports:
      - 30000:30000
    volumes:
       - 'mongodb_repl_data1:/data/db:z'
    restart: always
    command: "--bind_ip_all --replSet rs0 --port 30000"
  mongo1:
    hostname: mongo1
    container_name: mongo1
    image: mongo:latest
    expose:
    - 30001
    ports:
      - 30001:30001
    volumes:
       - 'mongodb_repl_data2:/data/db:z'
    restart: always
    command: "--bind_ip_all --replSet rs0 --port 30001"
  mongo2:
    hostname: mongo2
    container_name: mongo2
    image: mongo:latest
    expose:
    - 30002
    ports:
      - 30002:30002
    volumes:
       - 'mongodb_repl_data3:/data/db:z'
    restart: always
    command: "--bind_ip_all --replSet rs0 --port 30002"

volumes:
  mongodb_repl_data1:
    external: true
  mongodb_repl_data2:
    external: true
  mongodb_repl_data3:
    external: true
```

Step 3: Start the Docker containers

```bash
docker-compose.exe up -d
```

Step 4: Start an interactive MongoDb shell

```bash
docker exec -it mongo0 mongo --port 30000
```

Step 5: Configure the replica set

From the MongoDb shell, type (or paste) the following

```
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
```
If you use this, you probably have to update your hosts file, as well.

On Windows you can find it at:

C:\Windows\System32\drivers\etc\hosts

Add

127.0.0.1 mongo0 mongo1 mongo2 to the file and save it.

Step 6: Initiate the replica set

Still in the MongoDb shell, type (or paste) the following

rs.initiate(config);
End result

You should see the MongoDb shell switch to SECONDARY and if you hit Enter a few times it will switch to PRIMARY (it may start out as primary, as well).

You can exit the interactive MongoDb session with quit() or juct ctrl-c

Now you should be able to connect to the replica set using the following connection string

```
mongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0
```