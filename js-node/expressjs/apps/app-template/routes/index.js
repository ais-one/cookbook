'use strict'

const router = require('express').Router()

const { APP_NAME } = process.env

// const websocket = require('@es-labs/node/services/websocket') // .open(null, null) // or set to null
// websocket.setOnClientMessage = async (data, , isBinary ws, _wss) => { }
// websocket.setOnClientCLose =  (ws) => { }

// export your routes here - make sure no clashes
module.exports = (app) => {
  app.use(`/api/${APP_NAME}`,
    router.use('/', require('./base')), // http://127.0.0.1:3000/api/app-template/
    router.use('/categories', require('./categories')), // http://127.0.0.1:3000/api/app-template/categories/
    router.use('/webhooks', require('./webhooks')),
    router.use('/mongo-demo', require('./mongo-demo')),
  )
}
