'use strict'

let agenda

exports.open = (options = process.env) => {
  if (!agenda) {
    const { APP_PATH, APP_NAME, JOB_TYPES, JOB_MONGO_URL, JOB_COLLECTION } = process.env 

    const address = JOB_MONGO_URL
    const jobTypes = JOB_TYPES ? JOB_TYPES.split(',') : []
    if (jobTypes.length && address && JOB_COLLECTION) {
      const { Agenda } = require('agenda')
      const connectionOpts = { // mongodb options
        db: {
          address,
          collection: JOB_COLLECTION,
          options: {
            useUnifiedTopology: true
            // ssl: true
          }
        }
      }
      agenda = new Agenda(connectionOpts)
      const JOB_PATH = APP_PATH + '/apps/' + APP_NAME + '/jobs' // path to folder with the jobs
          jobTypes.forEach(type => {
        require(`${JOB_PATH}/${type}`)(agenda)
      })
      agenda.start() // Returns a promise, which should be handled appropriately
      console.log('agenda started - job count=' + jobTypes.length)
    } else {
      console.log('agenda not started (JOB_MONGO_URL, JOB_TYPES, JOB_COLLECTION)', address, JOB_TYPES, JOB_COLLECTION)
    }
  }
  return this
}

exports.close = async () => {
  if (agenda) {
    await agenda.stop()
    console.log('agenda closed')
  }
}

exports.get = () => agenda

// NOSONAR
// agenda = require('../worker.js');
// app.post('/users', (req, res, next) => {
//   agenda.now('registration email', { email: 'abc@test.com' })
// })
// Events - start, complete, success, fail
// can be start:<job name>
// agenda.on('success:send email', job => console.log(`Sent Email Successfully to ${job.attrs.data.to}`))
// agenda.on('fail:send email', (err, job) => console.log(`Job failed with error: ${err.message}`))