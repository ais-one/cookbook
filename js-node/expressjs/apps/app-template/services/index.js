'use strict'
// SERVICES
const services = {
  knex1: null,
  knex2: null,
  mongo1: null,
  keyv: null,
  // redis: null,
  // hazelcast: null
}

const StoreKeyV = require('@es-labs/node/services/db/keyv')
// const StoreRedis = require('@es-labs/node/services/db/redis')
// const StoreHazelcast = require('@es-labs/node/services/db/hazelcast')
const StoreKnex = require('@es-labs/node/services/db/knex') 
const StoreMongo = require('@es-labs/node/services/db/mongodb') 

const agenda = require('@es-labs/node/services/mq/agenda')
const bull = require('@es-labs/node/services/mq/bull')
const websocket = require('@es-labs/node/services/websocket')

const auth = require('@es-labs/node/auth')

const start = () => {
  console.log('services - start - begin')
  services.keyv = new StoreKeyV()
  services.keyv.open()
  // services.redis = new StoreRedis()
  // services.redis.open()
  // services.hazelcast = new StoreHazelcast()
  // services.hazelcast.open()
  services.knex1 = new StoreKnex()
  services.knex1.open()
  services.knex2 = new StoreKnex()
  services.knex2.open()
  services.mongo1 = new StoreMongo()
  services.mongo1.open()

  agenda.open()
  bull.open()
  websocket.open(null, null) // or set to null
  console.log('services - start - end')

  auth.setupAuth(services.keyv.get(), services.knex1.get()) // setup authorization
}

const stop = async () => {
  console.log('services - stop - begin')
  websocket.close() // websockets
  await bull.close()
  await agenda.close()

  await services.mongo1.open()
  await services.knex1.close()
  await services.knex2.close()
    // await services.hazelcast.close()
  // await services.redis.close()
  await services.keyv.close()
  console.log('services - stop - end')
}

module.exports = {
  start,
  stop,
  get: (service) => services[service]
}