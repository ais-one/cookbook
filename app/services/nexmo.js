const axios = require('axios')

const { NEXMO_KEY, NEXMO_SECRET } = require('../config')

const nexmo = {
    send: async function (sms, message) {
      try {
        return await axios.get(`https://rest.nexmo.com/sms/json?api_key=${NEXMO_KEY}&api_secret=${NEXMO_SECRET}&to=${sms}&from=AHOP&text=${message}`)
      } catch (e) {
        return null
      }
    }      
  }
  
  module.exports = nexmo
  