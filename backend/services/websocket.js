let wss

if (!wss) {
  const WS_PORT = process.env.WS_PORT || 3001
  const USE_HTTPS = process.env.USE_HTTPS || false
  const WebSocket = require('ws')
  const https = require('https')
  if (USE_HTTPS) {
    credentials = { key: fs.readFileSync(`${USE_HTTPS}/privkey.pem`), cert: fs.readFileSync(`${USE_HTTPS}/fullchain.pem`) }
    wss = new WebSocket.Server({ server: https.createServer(credentials).listen(WS_PORT) })
  } else {
    wss = new WebSocket.Server({ port: WS_PORT })
  }
  console.log('WS API listening on port ' + WS_PORT)
}

module.exports = wss
