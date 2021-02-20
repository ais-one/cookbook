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
      console.log('stopping')
      stop = true
      await producer.disconnect()
      console.log('end')
    } finally {
      // Do not call this as need time to close the server...
      // process.kill(process.pid, type)
    }
    return
  })
})




// https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10