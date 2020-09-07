## Kafka

Install the dependencies first

From vue-crud-x folder

```
npm i
```

### Kafka Broker

Start up using docker-compose

From vue-crud-x folder

```
cd docker-devenv
cd kafka
docker-compose up
```

Enter the running container shell. Create & list topic

```bash
docker exec -it sn-kafka /bin/bash

kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 1 --replication-factor 1
kafka-topics --bootstrap-server localhost:9092 --list

```

When you are done later after testing, you can run

```
docker-compose down
```

### Kafka Consumer

From vue-crud-x folder

```
cd sandbox
node kafkaRx.js
```

You will see message from a running producer every 2 seconds on the console

Kafka Consumer Example Usage file location [../sandbox/kafkaRx.js](../sandbox/kafkaRx.js)

### Kafka Producer

From vue-crud-x folder

```
cd sandbox
node kafkaTx.js
```

The producer will send a message every 2 seconds

Kafka Producer Example Usage file location [../sandbox/kafkaTx.js](../sandbox/kafkaTx.js)

