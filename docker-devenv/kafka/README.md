https://github.com/codingharbour/kafka-docker-compose

https://dev.to/de_maric/how-to-get-started-with-apache-kafka-in-5-minutes-18k5


docker-compose up -d

docker-compose ps

docker exec -it sn-kafka /bin/bash

```bash
kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server localhost:9092 --list
kafka-console-producer --broker-list localhost:9092 --topic test-topic
kafka-console-consumer --bootstrap-server localhost:9092 --topic test-topic
kafka-console-consumer --bootstrap-server localhost:9092 --topic test-topic --from-beginning
```





---


version: '2.1'
services:
 zookeeper-1:
   image: confluentinc/cp-zookeeper:latest
   environment:
     ZOOKEEPER_SERVER_ID: 1
     ZOOKEEPER_CLIENT_PORT: 22181
     ZOOKEEPER_TICK_TIME: 2000
     ZOOKEEPER_INIT_LIMIT: 5
     ZOOKEEPER_SYNC_LIMIT: 2
     ZOOKEEPER_SERVERS: localhost:22888:23888;localhost:32888:33888;localhost:42888:43888
   network_mode: host
   extra_hosts:
     — "moby:127.0.0.1"
 
 zookeeper-2:
   image: confluentinc/cp-zookeeper:latest
   environment:
     ZOOKEEPER_SERVER_ID: 2
     ZOOKEEPER_CLIENT_PORT: 32181
     ZOOKEEPER_TICK_TIME: 2000
     ZOOKEEPER_INIT_LIMIT: 5
     ZOOKEEPER_SYNC_LIMIT: 2
     ZOOKEEPER_SERVERS: localhost:22888:23888;localhost:32888:33888;localhost:42888:43888
   network_mode: host
   extra_hosts:
     — "moby:127.0.0.1"
 
 zookeeper-3:
   image: confluentinc/cp-zookeeper:latest
   environment:
     ZOOKEEPER_SERVER_ID: 3
     ZOOKEEPER_CLIENT_PORT: 42181
     ZOOKEEPER_TICK_TIME: 2000
     ZOOKEEPER_INIT_LIMIT: 5
     ZOOKEEPER_SYNC_LIMIT: 2
     ZOOKEEPER_SERVERS: localhost:22888:23888;localhost:32888:33888;localhost:42888:43888
   network_mode: host
   extra_hosts:
     — "moby:127.0.0.1" 
 kafka-1:
   image: confluentinc/cp-kafka:latest
   network_mode: host
   depends_on:
     — zookeeper-1
     — zookeeper-2
     — zookeeper-3
   environment:
     KAFKA_BROKER_ID: 1
     KAFKA_ZOOKEEPER_CONNECT: localhost:22181,localhost:32181,localhost:42181
     KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:19092
   ports:
     — "19092:19092"
   extra_hosts:
     — "moby:127.0.0.1"
 
 kafka-2:
   image: confluentinc/cp-kafka:latest
   network_mode: host
   depends_on:
     — zookeeper-1
     — zookeeper-2
     — zookeeper-3
   environment:
     KAFKA_BROKER_ID: 2
     KAFKA_ZOOKEEPER_CONNECT: localhost:22181,localhost:32181,localhost:42181
     KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:29092
   ports:
     — "29092:29092"
   extra_hosts:
     — "moby:127.0.0.1"
 
 kafka-3:
   image: confluentinc/cp-kafka:latest
   network_mode: host
   depends_on:
     — zookeeper-1
     — zookeeper-2
     — zookeeper-3
   environment:
     KAFKA_BROKER_ID: 3
     KAFKA_ZOOKEEPER_CONNECT: localhost:22181,localhost:32181,localhost:42181
     KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:39092
   ports:
     — "39092:39092"
   extra_hosts:
     — "moby:127.0.0.1"


<!--
extra_hosts:
  - "somehost:162.242.195.82"
  - "otherhost:50.31.209.229"
An entry with the ip address and hostname is created in /etc/hosts inside containers for this service, e.g:
  162.242.195.82  somehost
  50.31.209.229   otherhost
-->

https://medium.com/better-programming/kafka-docker-run-multiple-kafka-brokers-and-zookeeper-services-in-docker-3ab287056fd5

docker logs <zookeeper-1_containerId>
docker run --net=host --rm confluentinc/cp-zookeeper:latest bash -c “echo stat | nc localhost <ZOOKEEPER_CLIENT_PORT> | grep Mode”
docker logs <kafka-1_containerId>
docker run --net=host --rm confluentinc/cp-kafka:latest kafka-topics --create --topic <topic_name> --partitions <Number_of_partitions> --replication-factor <number_of_replication_factor> --if-not-exists --zookeeper localhost:32181
docker run --net=host --rm confluentinc/cp-kafka:latest kafka-topics --describe --topic testTopic --zookeeper localhost:32181
docker run --net=host --rm confluentinc/cp-kafka:latest bash -c “seq 42 | kafka-console-producer --broker-list localhost:29092 --topic testTopic && echo ‘Producer 42 message.’”
docker run --net=host --rm confluentinc/cp-kafka:latest kafka-console-consumer --bootstrap-server localhost:29092 --topic testTopic --new-consumer --from-beginning --max-message 42

Kafka_host = “0.0.0.0:19092,0.0.0.0:29092,0.0.0.0:39092”