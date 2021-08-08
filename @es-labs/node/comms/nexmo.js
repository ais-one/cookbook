'use strict'

const axios = require('axios')
let key
let api_secret
let sender

//NOSONAR
// nexmo.isms('6596935500', 'Blah ' + new Date())
// nexmo.ismsSend('6596935500', 'Blah ' + new Date())

const nexmo = {
  setup: function(options=global.CONFIG) {
    const { NEXMO_KEY, NEXMO_SECRET, NEXMO_SENDER = 'SMSnotice' } = options || {}
    key = NEXMO_KEY
    api_secret = NEXMO_SECRET
    sender = NEXMO_SENDER
  },
  // sms = 6511112222
  // one at a time...
  send: async function (sms, message, from) {
    try {
      if (!from) from = sender
      if (sms && message) {
        return await axios.get(`https://rest.nexmo.com/sms/json?api_key=${key}&api_secret=${api_secret}&to=${sms}&from=${from}&text=${message}`)
      }
    } catch (e) {
      console.log('send', e.toString())      
    }
    return null
  },
  // sms = 6511112222
  // one at a time...
  ismsSend: async function (sms, message, from) {
    const url = 'https://sms.era.sg/isms_mt.php?'
    try {
      if (sms && message) {
        const options = { 
          params: {
            uid: key,
            pwd: require('crypto').createHash('md5').update( api_secret ).digest('hex'),
            dnr: sms,
            snr: from || sender,
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

module.exports = nexmo
