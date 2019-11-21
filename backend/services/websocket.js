let wss

const { httpsCerts } = require('./certs')
const { WS_PORT } = require('../config')

if (!wss && WS_PORT) {
  const WebSocket = require('ws')
  const https = require('https')

  if (httpsCerts) {
    wss = new WebSocket.Server({ server: https.createServer(httpsCerts).listen(WS_PORT) })
  } else {
    wss = new WebSocket.Server({ port: WS_PORT })
  }
  console.log('WS API listening on port ' + WS_PORT)
}

module.exports = wss
