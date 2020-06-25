let queueMarketUpdates

exports.open = (config) => {
  const Queue = require('bull')
  const  { JOB_BULL } = config
  if (JOB_BULL) {
    if (!queueMarketUpdates) {
      queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')  
      queueMarketUpdates.process(processQueueMarketUpdates)  
    }  
  }
  return this
}

exports.close = () => {
  console.log('bull closed')
}

exports.get = () => queueMarketUpdates

// consumer
async function processQueueMarketUpdates(job) { // returns a promise
  const { message } = job.data
  console.log('Message from Bull MQ pub', message)
  // Passes the value the promise is resolved with to the "completed" event
  return Promise.resolve()
}

// module.exports = queueMarketUpdates
