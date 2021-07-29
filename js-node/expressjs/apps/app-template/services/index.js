'use strict'
// SERVICES
const keyv = require('@es-labs/node/services/db/keyv')
// const redis = require('@es-labs/node/services/db/redis')
// const hazelcast = require('@es-labs/node/services/db/hazelcast')
const knex = require('@es-labs/node/services/db/knex')
const mongodb = require('@es-labs/node/services/db/mongodb')
const agenda = require('@es-labs/node/services/mq/agenda')
const bull = require('@es-labs/node/services/mq/bull')
const websocket = require('@es-labs/node/services/websocket')

exports.start = () => {
  keyv.open()
  // redis.open()
  // hazelcast.open()
  knex.open()
  mongodb.open()
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
  // await redis.close()
  await keyv.close()
}
