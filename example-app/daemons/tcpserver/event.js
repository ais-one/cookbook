'use strict'
require('dotenv').config()

const processData = (data, client) => {
  console.log(data.toString('utf8'))
  // Write the data back to all the connected, the client will receive it as data from the server
}
const net = require('net')
const port = process.env.TCP_PORT
const host = process.env.TCP_HOST

const server = net.createServer()

server.on('connection', (client) => {
  console.log('TCP Client connected: ' + client.remoteAddress + ':' + client.remotePort)
  client.on('data', (data) => {
    console.log('TCP Client data: ' + client.remoteAddress + ': ' + client.remotePort)
    processData(data, client)
    client.destroy()
  })
})

server.on('close', () => console.log('TCP Server closed'))
server.on('error', (err) => { throw err })
server.listen(port, host, () => console.log(`TCP Server listening on: ${host}:${port}`))
require('../traps')(null, async () => server.close(() => server.unref()))
