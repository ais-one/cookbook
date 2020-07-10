console.log('Long running process sample', __filename)
console.log('this can be a Kafka producer... listen to incoming tcp messages and pushing to topic')
console.log('Do take note limitations for Long running NodeJS process')
console.log('Can also be for cronjobs (but better to use cronjob call an API)')

const path = require('path')
require(path.join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH

const { sleep } = require('esm')(module)(LIB_PATH + '/esm/sleep')

const run = async () => {
  while (true) {
    console.log('test long running ' + Date.now())
    await sleep(1000)
  }
  // process.exit(0)
}

run().catch(e => console.error(`[***] ${e.message}`, e))
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type =>
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
)

signalTraps.map(type =>
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
)
