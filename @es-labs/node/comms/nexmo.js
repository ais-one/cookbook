'use strict'

const axios = require('axios')

const { NEXMO_KEY, NEXMO_SECRET, NEXMO_FROM = 'SMSnotice' } = global.CONFIG

const nexmo = {
  // sms = 6511112222
  // one at a time...
  send: async function (sms, message, from = NEXMO_FROM) {
    try {
      if (sms && message) {
        return await axios.get(`https://rest.nexmo.com/sms/json?api_key=${NEXMO_KEY}&api_secret=${NEXMO_SECRET}&to=${sms}&from=${from}&text=${message}`)
      }
    } catch (e) {
      console.log('send', e.toString())      
    }
    return null
  },
  // sms = 6511112222
  // one at a time...
  ismsSend: async function (sms, message, from = NEXMO_FROM) {
    const url = 'https://sms.era.sg/isms_mt.php?'
    try {
      if (sms && message) {
        const options = { 
          params: {
            uid: NEXMO_KEY,
            pwd: require('crypto').createHash('md5').update( NEXMO_SECRET ).digest('hex'),
            dnr: sms,
            snr: from,
            msg: message,
            split: 5
          }
        }
        return await axios.get(url, options)
      }
    } catch (e) {
      console.log('ismsSend', e.toString())      
    }
    return null
  }
}

// nexmo.isms('6596935500', 'Blah ' + new Date())
// nexmo.ismsSend('6596935500', 'Blah ' + new Date())

module.exports = nexmo
