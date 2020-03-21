const Queue = require('bull')

let queueMarketUpdates
if (!queueMarketUpdates) {
  queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')

  // consumer
  async function processQueueMarketUpdates(job) { // returns a promise
    const { message } = job.data
    console.log('Message from Bull MQ pub', message)
    // Passes the value the promise is resolved with to the "completed" event
    return Promise.resolve()
  }

  queueMarketUpdates.process(processQueueMarketUpdates)  
}

module.exports = queueMarketUpdates
