'use strict'

const axios = require('axios')
let key
let sender

// Sendgrid, Mailgun

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// let sgMail
// if (!sgMail && SENDGRID_KEY) {
//   sgMail = require('@sendgrid/mail')
//   sgMail.setApiKey(SENDGRID_KEY)
// }

function setupSendGrid(options = global.CONFIG) {
  const { SENDGRID_KEY, SENDGRID_SENDER } = options || {}
  key = SENDGRID_KEY
  sender = SENDGRID_SENDER
}

async function sendSendGrid(to, from, subject, text, html) {
  try {
    // const msg = {
    //   to,
    //   from,
    //   subject,
    //   text
    // }
    // if (html) msg.html = html
    // await sgMail.send(msg)
    if (!key) return
    if (!from) from = sender

    const body = {
      personalizations: [
        { to: [{ email: to }] }
      ],
      from: { email: from },
      subject,
      content: [{"type": "text/plain", "value": text}]
    }
    await axios.post('https://api.sendgrid.com/v3/mail/send', body, { headers: { Authorization: 'Bearer ' + key } })
    console.log('sendMail ok', to, from, subject, text)
  } catch (e) {
    console.log('sendMail err', e.toString(), key)
  }
}

// sendSendGrid('aaronjxz@gmail.com', 'eslabs.com@gmail.com', 'Subj', 'Test Message').then(a => console.log('ok', a)).catch(e => console.log('fail', e))

module.exports = {
  setupSendGrid,
  sendSendGrid
}
