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

appOpen()

const server = net.createServer()

server.on('connection', (client) => {
  console.log('TCP Client connected: ' + client.remoteAddress + ':' + client.remotePort)
  client.on('data', (data) => {
    console.log('TCP Client data: ' + client.remoteAddress + ': ' + client.remotePort)
    appData(data, client)
    client.destroy()
  })
})

server.on('close', () => console.log('TCP Server closed'))
server.on('error', (err) => { throw err })
server.listen(port, host, () => console.log(`TCP Server listening on: ${host}:${port}`))
require('../traps')(async () => {
  server.close(() => server.unref())
  appClose()
})
