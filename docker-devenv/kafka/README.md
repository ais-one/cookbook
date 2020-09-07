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
