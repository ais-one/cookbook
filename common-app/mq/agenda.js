let agenda
if (!agenda) {
  const APPNAME = require('../../appname')

  const  { JOB_TYPES, JOB_DB, JOB_COLLECTION } = require('../config')

  const jobTypes = JOB_TYPES ? JOB_TYPES.split(',') : []

  const Agenda = require('agenda')
 
  const connectionOpts = {
    db: {
      address: JOB_DB,
      collection: JOB_COLLECTION
      //, options: {ssl: true}
    }
  }
  
  agenda = new Agenda(connectionOpts)
  
  jobTypes.forEach(type => {
    require(`../../${APPNAME}/jobs/` + type)(agenda)
  })
   
  if (jobTypes.length) {
    agenda.start() // Returns a promise, which should be handled appropriately
  }  
}
 
module.exports = agenda

// agenda = require('../worker.js');
// app.post('/users', (req, res, next) => {
//     agenda.now('registration email', { email: 'abc@test.com' })
// })

// Events - start, complete, success, fail
// can be start:<job name>
// agenda.on('success:send email', job => {
//   console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
// });
// agenda.on('fail:send email', (err, job) => {
//   console.log(`Job failed with error: ${err.message}`);
// });