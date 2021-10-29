'use strict'
require('dotenv').config()

let appOpen = () => console.log('SERVER OPEN CALLED')
let appClose = () => console.log('SERVER CLOSE CALLED')
let appData = (data, client) => console.log('DATA', data)

try {
  const app = require('./' + process.env.TCP_APPNAME)
  appOpen = app.open
  appClose = app.close
  appData = app.onData
} catch (e) {
  console.log(e.toString())
}

const net = require('net')
const port = process.env.TCP_PORT
const host = process.env.TCP_HOST
let sockets = []

appOpen()

const server = net.createServer()

server.listen(port, host, () => console.log('TCP Server is running on port ' + port + '.'))

server.on('connection', (client) => {
  console.log('CLIENT CONNECTED: ' + client.remoteAddress + ':' + client.remotePort)
  sockets.push(client)
  // client.setEncoding('utf8')
  client.on('data', (data) => {
    console.log('CLIENT DATA: ' + client.remoteAddress + ': ' + data)
    appData(data, client)
    // Write the data back to all the connected, the client will receive it as data from the server
  })
  client.on('close', (data) => {
    let index = sockets.findIndex((o) => {
      return o.remoteAddress === client.remoteAddress && o.remotePort === client.remotePort
    })
    if (index !== -1) sockets.splice(index, 1)
    console.log('CLIENT CLOSED: ' + client.remoteAddress + ' ' + client.remotePort)
  })
  client.on('error', () => console.log('Socket error'))
})

server.on('close', () => console.log('SERVER CLOSED'))
server.on('error', (err) => { throw err })

require('@es-labs/node/traps')(async () => {
  for (let socket of sockets) socket.destroy()
  server.close(() => server.unref())
  appClose()
  return 0
})
