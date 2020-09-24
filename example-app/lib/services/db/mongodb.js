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

  close: async () => {
    if (mongo.client) await mongo.client.close()
    console.log('MONGODB CLOSED')
  },
  open: () => {
    const { MONGO_URL } = global.CONFIG
    if (!mongo.db && MONGO_URL) {
      const { MongoClient } = require('mongodb')
      try {
        const client = new MongoClient(MONGO_URL, { // mongodb://localhost:27017/?replicaSet=rs0
          useUnifiedTopology: true,
          useNewUrlParser: true // reconnectTries: Infinity, poolSize: 10, reconnectInterval
          // auth: { user: 'test', password: 'test123' },
          // authMechanism: authMechanism,
          // uri_decode_auth: true
          // reconnectTries: Infinity,
          // poolSize: 10
          // reconnectInterval
        })
        mongo.client = client
        // mongo.client.startSession({ defaultTransactionOptions })
        client.connect(err => {
          if (!err) {
            console.log('MONGODB CONNECTED', MONGO_URL)
            mongo.db = client.db()
            // mongo.stream = db.db('mm').collection('exchangeUsers').watch() //  for streaming data
            // mongo.stream.on('change', (change) => {
            //   console.log(change); // You could parse out the needed info and send only that data.
            //   // use websocket to listen to changes
            // })
          }
          else console.log('MONGODB', err)
        })
      } catch (e) { console.log('MONGODB', e) }
    }
    return mongo
  }
}

module.exports = mongo

// USAGE:
// const mongo = require('<RELATIVE PATH TO>/mongodb').open
// await mongo.db.collection('users').findOne({ email: email })
