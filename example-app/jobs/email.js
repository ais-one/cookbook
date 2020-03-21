module.exports = function (agenda) {
  agenda.define('registration email', async job => {
    const { email } = job.attrs.data
    console.log('Message prcessed, email: ', email)
    // await email(user.email(), 'Thanks for registering', 'Thanks for registering')
    const rv = await job.remove()
    console.log(rv)
  })

  agenda.define('reset password', async job => {
    // Etc
  })

  // More email related jobs
};