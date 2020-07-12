const axios = require('axios')

const { NEXMO_KEY, NEXMO_SECRET, NEXMO_FROM = 'SMSnotice' } = global.CONFIG

const nexmo = {
  send: async function (sms, message, from = NEXMO_FROM) {
    try {
      return await axios.get(`https://rest.nexmo.com/sms/json?api_key=${NEXMO_KEY}&api_secret=${NEXMO_SECRET}&to=${sms}&from=${from}&text=${message}`)
    } catch (e) {
      return null
    }
  },
  ismsSend: async function (sms, message, from = NEXMO_FROM) {
    try {
      const url = 'https://sms.era.sg/isms_mt.php?'
      const options = { 
        params: {
          uid: NEXMO_KEY,
          // pwd: 'xxxxxxxxyyyyyyyyzzzzzzzzxxxxxxxx',
          pwd: md5( NEXMO_SECRET ),
          dnr: sms,
          snr: from,
          msg: message,
          split: 5
        }
      }
      return await axios.get(url, options)    
    } catch (e) {
      return null
    }
  }
}

// nexmo.isms('6596935500', 'Blah ' + new Date())
// nexmo.ismsSend('6596935500', 'Blah ' + new Date())

module.exports = nexmo
