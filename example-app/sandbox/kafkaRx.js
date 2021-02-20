/* eslint-disable */
const { Kafka, logLevel  } = require('kafkajs')
 
const kafka = new Kafka({
  logLevel: logLevel.ERROR, // NOTHING, ERROR, WARN, INFO, and DEBUG
  clientId: 'my-app',
  brokers: ['localhost:9092'] // single broker test
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
   // Consuming
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

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      return process.exit(0)
    } catch (_) {
      return process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
      console.log('end')
    } finally {
      // process.kill(process.pid, type)
    }
    return
  })
})

