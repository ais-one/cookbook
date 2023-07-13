'use strict'
// SERVICES
const services = {
  auth: null,
  knex1: null,
  knex2: null,
  mongo1: null,
  keyv: null,
  //NOSONAR redis: null,
}

const StoreKeyV = require('@es-labs/node/services/db/keyv')
//NOSONAR const StoreRedis = require('@es-labs/node/services/db/redis')
const StoreKnex = require('@es-labs/node/services/db/knex') 
const StoreMongo = require('@es-labs/node/services/db/mongodb') 

const agenda = require('@es-labs/node/services/mq/agenda')
const websocket = require('@es-labs/node/services/websocket')

const auth = require('@es-labs/node/auth')

const start = async () => {
  // console.log('services - start - begin')
  services.keyv = new StoreKeyV()
  services.keyv.open()
  //NOSONAR services.redis = new StoreRedis()
  //NOSONAR services.redis.open()
  services.knex1 = new StoreKnex()
  await services.knex1.open()
  services.knex2 = new StoreKnex()
  await services.knex2.open()
  services.mongo1 = new StoreMongo()
  services.mongo1.open()

  agenda.open()
  websocket.open(null, null) // or set to null

  services.auth = auth
  auth.setupAuth(services.keyv.get(), services.knex1.get()) // setup authorization
}

const stop = async () => {
  // console.log('services - stop - begin')
  websocket.close() // websockets
  await agenda.close()

  await services.mongo1.open()
  await services.knex1.close()
  await services.knex2.close()
  // await services.redis.close()
  await services.keyv.close()
  console.log('services - stop - end')
}

module.exports = {
  start,
  stop,
  get: (service) => services[service]
}