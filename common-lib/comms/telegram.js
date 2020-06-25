const axios = require('axios')

const { TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID } = require('../config')

console.log('TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID', TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID)

async function sendTgChannel(text) {
  try {
    const rv = await axios.get('https://api.telegram.org/bot' + TELEGRAM_API_KEY + '/sendMessage?chat_id=' + TELEGRAM_CHANNEL_ID + '&text=' + text)
    console.log()
    return rv // { id, date. pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

async function sendTgChatId(chatId, text) {
  try {
    // console.log('chatId, text', chatId, text)
    const rv = await axios.get('https://api.telegram.org/bot' + TELEGRAM_API_KEY + '/sendMessage?chat_id=' + chatId + '&text=' + text)
    console.log()
    return rv // { id, date. pts, seq }
  } catch (e) {
    return { err: e.toString() }
  }
}

module.exports = {
  sendTgChannel,
  sendTgChatId
}
