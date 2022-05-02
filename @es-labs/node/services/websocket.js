'use strict'
// https://www.npmjs.com/package/ws
// NOTE: if --forcedExit --detectOpenHandles in JEST test, will cause error
// TBD: testing for websockets
const WebSocket = require('ws')
const https = require('https')

let wss
let onClientConnect = (ws) => { 
  // console.log('client connected')
}
let onClientClose = (ws) => { 
  // console.log('client disconnected')
}
let onClientMessage = async (data, isBinary, ws, _wss) => { // client incoming message
  const message = isBinary ? data : data.toString()
  // console.log('message', message)
  try { // try-catch only detect immediate error, cannot detect if write failure    
    if (_wss) { // send to other clients except self
      _wss.clients.forEach((client) => {
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

exports.get = () => wss // get wss so that you can send messages to other clients...

exports.send = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

exports.open = (server=null, app=null) => {
  const { WS_KEEEPALIVE_MS, WS_PORT } = process.env
  const { HTTPS_PRIVATE_KEY, HTTPS_CERTIFICATE } = process.env
  let err
  try {
    if (!wss && WS_PORT) {
      if (HTTPS_CERTIFICATE) {
        if (!server) server = https.createServer({
          key: HTTPS_PRIVATE_KEY, cert: HTTPS_CERTIFICATE
        }).listen(WS_PORT) // use same port, create server because of graphql subscriptions
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
          onClientConnect(ws) // what else to do when client connects
          ws.isAlive = true
          ws.on('pong', () => { ws.isAlive = true })
          ws.on('close', () => onClientClose(ws))
          ws.on('message', (data, isBinary) => onClientMessage(data, isBinary, ws, wss))
        })
        setInterval(() => { // set keep-alive
          // console.log('WS Clients: ', wss.clients.size)
          wss.clients.forEach((ws) => {
            if (!ws.isAlive) return ws.terminate() // force close
            ws.isAlive = false
            return ws.ping(() => {}) // NOSONAR
          })
        }, WS_KEEEPALIVE_MS)
      }
    } else {
      console.log('NO WS Service To Open')
    }
  } catch (e) {
    err = e.toString()
  }
  console.log('WS Open ' + (err ? err : 'Done'))
  return this
}

exports.close = function () {
  try { // close all connections
    if (wss) {
      wss.close()
      // wss.clients.forEach(client => client.close(0, 'wss close() called')) // close gracefully
      for (const client of wss.clients) client.terminate() // https://github.com/websockets/ws/releases/tag/8.0.0
      wss = null //delete wss
    }
  } catch (e) {
    console.error(e.toString())
  }
  console.log('WS API CLOSE OK')
}

exports.setOnClientMessage = function (onClientMessageFn) {
  onClientMessage = onClientMessageFn
}

exports.setOnClientConnect = function (onClientConnectFn) { //  what to do when client connects
  onClientConnect = onClientConnectFn
}

exports.setOnClientCLose = function (onClientCloseFn) { //  what to do when client closes
  onClientClose = onClientCloseFn
}

// NOSONAR
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
