/* eslint-disable */
const { Kafka, logLevel } = require('kafkajs')
 
const kafka = new Kafka({
  logLevel: logLevel.ERROR, // NOTHING, ERROR, WARN, INFO, and DEBUG
  clientId: 'my-app',
  brokers: ['localhost:9092'] // single broker test
})

const producer = kafka.producer()
let stop = false

// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const run = async () => {
  await producer.connect()

  setTimeout(async () => {
    await producer.send({ topic: 'test-topic', messages: [ { value: 'Hello Kafka ' + (new Date()).toISOString() } ] })
  }, 2000)
  // process.exit(0)
}

run().catch(e => console.error(`[***] ${e.message}`, e))

require('./traps')(async () => {
  try {
    stop = true
    await producer.disconnect()
  } finally {
    return 0
  }
})
