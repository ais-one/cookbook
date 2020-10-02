'use strict'

// use the command below in Windows to test exit
// set NODE_ENV=development&&node index.js

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
// signals: http://man7.org/linux/man-pages/man7/signal.7.html
// node signal events: https://nodejs.org/dist/latest-v11.x/docs/api/process.html#process_signal_events
// kubernetes shutdown: https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-terminating-with-grace

module.exports = async function (server, shutdown) {
  const handleExit = async (signal) => {
    console.log(`Received ${signal}. Close my server properly. (nodemon causes problems here)`)
    server.close(async () => {
      // close your other stuff...
      try {
        await shutdown()
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