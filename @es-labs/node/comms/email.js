'use strict'

const axios = require('axios')
const  { SENDGRID_KEY, SENDGRID_SENDER } = global.CONFIG

// Sendgrid, Mailgun

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// let sgMail
// if (!sgMail && SENDGRID_KEY) {
//   sgMail = require('@sendgrid/mail')
//   sgMail.setApiKey(SENDGRID_KEY)
// }

async function sendGrid(to, from, subject, text, html) {
  try {
    // const msg = {
    //   to,
    //   from,
    //   subject,
    //   text
    // }
    // if (html) msg.html = html
    // await sgMail.send(msg)
    if (!SENDGRID_KEY) return
    if (!from) from = SENDGRID_SENDER

    const body = {
      personalizations: [
        {
          to: [{ email: to }]
        }
      ],
      from: {email: from},
      subject,
      content: [{"type": "text/plain", "value": text}]
    }
    const options = {
      headers: {
        AUthorization: 'Bearer ' + SENDGRID_KEY
      } 
    }
    await axios.post('https://api.sendgrid.com/v3/mail/send', body, options)
    console.log('sendMail ok', to, from, subject, text)
  } catch (e) {
    console.log('sendMail err', e.toString(), SENDGRID_KEY)
  }
}

// sendGrid('aaronjxz@gmail.com', 'seintern@visiongroup.co', 'Subj', 'Test Message').then(a => console.log('ok', a)).catch(e => console.log('fail', e))

module.exports = {
  sendGrid
}
