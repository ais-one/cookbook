const express = require('express')
const webhookRoutes = express.Router()

module.exports = webhookRoutes

// channel
// https://stackoverflow.com/questions/33858927/how-to-obtain-the-chat-id-of-a-private-telegram-channel
// login under your account at web version of Telegram : https://web.telegram.org
// Find your channel. See to your url, it should be like https://web.telegram.org/#/im?p=c1055587116_11052224402541910257
// Grab "1055587116" from it, and add "-100" as a prefix.
// https://api.telegram.org/bot554067249:AAECDGe3IOy6bpY64_l1kP4uvQYfqfH9GcI/sendMessage?chat_idx=-1001319964716&text=received

// on mobile
// https://stackoverflow.com/questions/33126743/how-do-i-add-my-bot-to-a-channel
// Open Channel info (in app title)
// Choose Administrators
// Add Administrator
// There will be no bots in contact list, so you need to search for it. Enter your bot's username
// Clicking on it you make it as administrator./33126743/how-do-i-add-my-bot-to-a-channel
