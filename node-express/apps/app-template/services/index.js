'use strict'
// SERVICES
const knex = require('@es-labs/node/services/db/knex')
const mongodb = require('@es-labs/node/services/db/mongodb')
const agenda = require('@es-labs/node/services/mq/agenda')
const bull = require('@es-labs/node/services/mq/bull')
const websocket = require('@es-labs/node/services/websocket')
// const hazelcast = require('@es-labs/node/services/db/hazelcast')

exports.start = () => {
  mongodb.open()
  knex.open()
  agenda.open()
  bull.open()
  websocket.open(null, null) // or set to null
  // hazelcast.open()
}

exports.stop = async () => {
  websocket.close() // websockets
  await bull.close()
  await agenda.close()
  await mongodb.close()
  await knex.close()
  // await hazelcast.close()
}
