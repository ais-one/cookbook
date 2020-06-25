const axios = require('axios')

const { NEXMO_KEY, NEXMO_SECRET, NEXMO_FROM = '' } = require('../config')

const nexmo = {
  send: async function (sms, message) {
    try {
      return await axios.get(`https://rest.nexmo.com/sms/json?api_key=${NEXMO_KEY}&api_secret=${NEXMO_SECRET}&to=${sms}&from=${NEXMO_FROM}&text=${message}`)
    } catch (e) {
      return null
    }
  },
  ismsSend: async function (sms, message) {
    try {
      const url = 'https://sms.era.sg/isms_mt.php?'
      const options = { 
        params: {
          uid: NEXMO_KEY,
          // pwd: 'xxxxxxxxyyyyyyyyzzzzzzzzxxxxxxxx',
          pwd: md5( NEXMO_SECRET ),
          dnr: sms,
          snr: NEXMO_FROM,
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
