'use strict'

const categories = require('./categories')


// const websocket = require('@es-labs/node/services/websocket') // .open(null, null) // or set to null
// websocket.setOnClientMessage = async (message, ws, _wss) => { }
// websocket.setOnClientCLose =  (ws) => { }

module.exports = (app) => {
  app.use(`/api/app-custom`, categories )
}
