// use the command below in Windows to test exit
// set NODE_ENV=development&&node index.js

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
// signals: http://man7.org/linux/man-pages/man7/signal.7.html
// node signal events: https://nodejs.org/dist/latest-v11.x/docs/api/process.html#process_signal_events
// kubernetes shutdown: https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-terminating-with-grace

const { sleep } = require('esm')(module)('../esm/sleep')

module.exports = async function (server) {
  // process.stdin.resume()

  const objection = require('../services/db/objection').open()
  const mongodb = await require('../services/db/mongodb').open()

  const websocket = require('../services/websocket').open(null, null) // or set to null
  const agenda = require('../services/mq/agenda').open()
  const bull = require('../services/mq/bull').open()

  // this will not work when run using npm
  const handleExit = async (signal) => {
    console.log(`Received ${signal}. Close my server properly.`)
    server.close(async () => {
      // close your other stuff...
      try {
        // console.log('websocket', websocket.close)
        websocket.close() // websockets
        await agenda.close()
        await bull.close()
        await mongodb.close()
        await objection.close()
        // console.log('bull', bull.close)
        // TBD does apollo graphql have a shutdown?
        await sleep(10) // wait awhile more for things to settle
        console.log('Server close done')
      } catch (e) {
        console.log(e)
      }
      process.exit(0)
    })  
  }

  if (server) {
    process.on('SIGINT', handleExit)
    process.on('SIGQUIT', handleExit)
    process.on('SIGTERM', handleExit)
  }
  return this
}