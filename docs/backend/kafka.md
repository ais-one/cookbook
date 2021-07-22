## Kafka

Install the dependencies first

From cookbook folder

```
npm i
```

### Kafka Broker

Start up using docker-compose

From cookbook folder

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

From cookbook folder

```
cd sandbox
node kafkaRx.js
```

You will see message from a running producer every 2 seconds on the console

Kafka Consumer Example Usage file location [../js-node/kafkaRx.js](../js-node/kafkaRx.js)

### Kafka Producer

From cookbook folder

```
cd sandbox
node kafkaTx.js
```

The producer will send a message every 2 seconds

Kafka Producer Example Usage file location [../js-node/kafkaTx.js](../js-node/kafkaTx.js)
