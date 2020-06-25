// NOTE: if --forcedExit --detectOpenHandles in JEST test, will cause error
// TBD: testing for websockets
let wss

let onClientClose = (ws) => {
  // console.log('client disconnected')
} // client disconnected

let onClientMessage = async (message, ws) => { // client incoming message
  // console.log('message', message)
  try { // try-catch only detect immediate error, cannot detect if write failure    
    if (wss) { // send to other clients except self
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message) // send message to others 
        }
      })
      // ws.send('something', function ack(error) { console.log }) // If error !defined, send has been completed, otherwise error object will indicate what failed.
      ws.send(message) // echo back message...
    }
  } catch (e) {
    console.log(e.toString())
  }
}

exports.open = function (server=null, app=null, config, cb) {
  const { WS_PORT, WS_KEEEPALIVE_MS, httpsCerts } = config
  let err
  try {
    if (!wss && WS_PORT) {
      const WebSocket = require('ws')
      const https = require('https')
      if (httpsCerts) {
        if (!server) server = https.createServer(httpsCerts).listen(WS_PORT) // use same port
        wss = new WebSocket.Server({ server })
      } else {
        if (!server) wss = new WebSocket.Server({ port: WS_PORT }) // use seperate port
        else wss = new WebSocket.Server({ server })
      }
      if (app) server.on('request', app)

      console.log('WS API listening on port ' + WS_PORT)
      if (wss) {
        wss.on('connection', (ws) => {
          // console.log('ws client connected')
          ws.isAlive = true
          ws.on('pong', () => { ws.isAlive = true })
          ws.on('close', () => onClientClose(ws))
          ws.on('message', message => onClientMessage(message, ws))
        })
        setInterval(() => { // set keep-alive
          // console.log('WS Clients: ', wss.clients.size)
          wss.clients.forEach((ws) => {
            if (!ws.isAlive) return ws.terminate() // force close
            ws.isAlive = false
            ws.ping(() => {})
          })
        }, WS_KEEEPALIVE_MS)
      }
    }
  } catch (e) {
    err = e.toString()
  }
  if (cb) cb (err) // run the callback function, err = undefined means ok
  return this
}

exports.close = function (cb) {
  let err
  try { // close all connections
    if (wss) {
      wss.close()
      wss.clients.forEach(client => client.close(0, 'wss close() called')) // close gracefully
      // delete wss
      // wss = null
    }
  } catch (e) {
    err = e.toString()
  }
  if (cb) cb(err) // run the callback function, err = undefined means ok
}

exports.setOnClientMessage = function (onClientMessageFn) {
  onClientMessage = onClientMessageFn
}

exports.setOnClientCLose = function (onClientCloseFn) {
  onClientClose = onClientCloseFn
}

// function heartbeat() {
//   clearTimeout(this.pingTimeout)
//   // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
//   // equal to the interval at which your server sends out pings plus a
//   // conservative assumption of the latency.
//   this.pingTimeout = setTimeout(() => {
//     this.terminate()
//   }, 30000 + 1000)
//   const client = new WebSocket('wss://echo.websocket.org/')
//   client.on('open', heartbeat)
//   client.on('ping', heartbeat)
//   client.on('close', function clear() {
//   clearTimeout(this.pingTimeout)
// })

// let WSServer = require('ws').Server
// // Create web socket server on top of a regular http server
// let wss = new WSServer({ server })
// server.on('request', app)
