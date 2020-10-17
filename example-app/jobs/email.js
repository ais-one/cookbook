'use strict'

module.exports = function (agenda) {
  agenda.define('registration email', async job => {
    const { email } = job.attrs.data
    console.log('Message prcessed, email: ', email)
    const rv = await job.remove()
    console.log(rv)
  })

  agenda.define('reset password', async job => {
    // Etc
  })
  // More email related jobs
}