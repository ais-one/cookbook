'use strict'

const axios = require('axios')
const { SENDGRID_KEY, SENDGRID_SENDER } = process.env

exports.send = async (to, from, subject, text, html) => {
  try {
    if (!SENDGRID_KEY) return
    if (!from) from = SENDGRID_SENDER
    const body = {
      personalizations: [
        { to: [{ email: to }] }
      ],
      from: { email: from },
      subject,
      content: [{"type": "text/plain", "value": text}]
    }
    await axios.post('https://api.sendgrid.com/v3/mail/send', body, { headers: { Authorization: 'Bearer ' + SENDGRID_KEY } })
    console.log('sendMail ok', to, from, subject, text)
  } catch (e) {
    console.log('sendMail err', e.toString(), SENDGRID_KEY)
  }
}

// send('aaronjxz@gmail.com', 'eslabs.com@gmail.com', 'Subj', 'Test Message').then(a => console.log('ok', a)).catch(e => console.log('fail', e))
