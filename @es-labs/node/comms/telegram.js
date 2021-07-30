'use strict'

const axios = require('axios')
let apiKey
let channelId

function setup(options = global.CONFIG) {
  const { TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID } = options || {}
  // console.log('TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID', TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID)
  apiKey = TELEGRAM_API_KEY
  channelId = TELEGRAM_CHANNEL_ID
}

async function sendChannelMsg(text) {
  try {
    return await axios.get('https://api.telegram.org/bot' + apiKey + '/sendMessage?chat_id=' + channelId + '&text=' + text) //NOSONAR { id, date, pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

async function sendChatMsg(chatId, text) {
  try {
    // console.log('chatId, text', chatId, text)
    return await axios.get('https://api.telegram.org/bot' + apiKey + '/sendMessage?chat_id=' + chatId + '&text=' + text) //NOSONAR { id, date, pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

module.exports = {
  setup,
  sendChannelMsg,
  sendChatMsg
}
