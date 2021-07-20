'use strict'

const express = require('express')

let clients = []

function sendEventsToAll(data) {
  // console.log('Send SSE', clients, data)
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}`))
}

module.exports = express.Router({caseSensitive: true})
  .get('/register', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    })

    const data = `data: ${JSON.stringify({ hello: "world" })}`
    res.write(data)

    const clientId = Date.now();
    const newClient = { id: clientId, res } // res for send messages
    clients.push(newClient)

    req.on('close', () => {
      // console.log(`${clientId} Connection closed`)
      clients = clients.filter(client => client.id !== clientId)
      // console.log('SSE Clients', clients)
    })
  })

  .post('/event', (req, res) => {
    const update = req.body;
    res.json(update)
    return sendEventsToAll(update)
  })

  .get('/status', (req, res) => res.json({ clients: clients.length }))
  