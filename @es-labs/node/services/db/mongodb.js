'use strict'

// const ObjectID = require('mongodb').ObjectID
const DEFAULT_TRANSACTION_OPTIONS = {
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' },
  readPreference: 'primary'
}

const mongo = {
  client: null,
  db: null,
  session: null,
  stream: null,
  defaultTransactionOptions: DEFAULT_TRANSACTION_OPTIONS,
  ObjectID: null,
}

exports.close =  async () => {
  if (mongo.client) await mongo.client.close()
  console.log('MONGODB CLOSED')
},

exports.open = async () => {
  const { MONGO_URL, MONGO_OPTIONS } = global.CONFIG
  if (!mongo.db && MONGO_URL) {
    const { MongoClient, ObjectID } = require('mongodb')
    mongo.ObjectID = ObjectID
    try {
      const client = new MongoClient(MONGO_URL, MONGO_OPTIONS)
      // {
      //   useUnifiedTopology: true,
      //   useNewUrlParser: true,
      //   auth: { user: 'test', password: 'test123' },
      //   authMechanism: authMechanism,
      //   uri_decode_auth: true
      //   reconnectTries: 1000, // How To Set Infinity?
      //   poolSize: 10,
      //   reconnectInterval: 1000, // ms
      //   autoReconnect: true
      // }
      mongo.client = client
      // mongo.client.startSession({ defaultTransactionOptions })
      await client.connect()
      mongo.db = client.db()
      // mongo.stream = db.db('mm').collection('exchangeUsers').watch() //  for streaming data
      // mongo.stream.on('change', (change) => {
      //   console.log(change); // You could parse out the needed info and send only that data.
      //   // use websocket to listen to changes
      // })
      console.log('MONGODB CONNECTED', MONGO_URL)
    } catch (e) { console.log('MONGODB ERROR', MONGO_URL, e.toString()) }
  }
  // return mongo
  return this
}

exports.get = () => mongo
exports.mongo = mongo
// module.exports = mongo

// USAGE:
// const mongo = require('<RELATIVE PATH TO>/mongodb').open
// await mongo.db.collection('users').findOne({ email: email })
