/* eslint-disable */
'use strict'; (async function() {
const { Kafka, logLevel } = require('kafkajs')
const kafka = new Kafka({
  logLevel: logLevel.ERROR, // NOTHING, ERROR, WARN, INFO, and DEBUG
  clientId: 'my-app',
  brokers: ['localhost:9092'] // single broker test
})
const producer = kafka.producer()
await producer.connect()
await producer.send({ topic: 'test-topic', messages: [ { value: 'Hello Kafka ' + (new Date()).toISOString() } ] })
await producer.disconnect()
}())
