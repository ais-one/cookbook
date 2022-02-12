'use strict'

const axios = require('axios')
const { TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID } = process.env

async function sendChannelMsg(text) {
  try {
    return await axios.get('https://api.telegram.org/bot' + TELEGRAM_API_KEY + '/sendMessage?chat_id=' + TELEGRAM_CHANNEL_ID + '&text=' + text) //NOSONAR { id, date, pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

async function sendChatMsg(chatId, text) {
  try {
    // console.log('chatId, text', chatId, text)
    return await axios.get('https://api.telegram.org/bot' + TELEGRAM_API_KEY + '/sendMessage?chat_id=' + chatId + '&text=' + text) //NOSONAR { id, date, pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

module.exports = {
  setup,
  sendChannelMsg,
  sendChatMsg
}
