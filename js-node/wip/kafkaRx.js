/* eslint-disable */
'use strict'
const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  logLevel: logLevel.ERROR, // NOTHING, ERROR, WARN, INFO, and DEBUG
  clientId: 'my-app',
  brokers: ['localhost:9092'] // single broker test
})
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        timestamp: message.timestamp,
        key: message.key,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))
require('@es-labs/node/traps')(async () => await consumer.disconnect())
