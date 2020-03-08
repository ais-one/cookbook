const  { SENDGRID_KEY } = require('./config')

// Sendgrid, Mailgun

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
let sgMail
if (!sgMail && SENDGRID_KEY) {
  sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(SENDGRID_KEY)
}

async function sendGrid(to, from, subject, text, html) {
  try {
    const msg = {
      to,
      from,
      subject,
      text
    }
    if (html) msg.html = html
    await sgMail.send(msg)
    // console.log('sendMail ok', to, from, subject, text)
  } catch (e) {
    // console.log('sendMail err', e.toString())
  }
}

module.exports = {
  sendGrid
}
