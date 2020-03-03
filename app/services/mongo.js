// const ObjectID = require('mongodb').ObjectID
const { MONGO_URL } = require('../'+ require('../appname') + '/config')
const { MongoClient } = require('mongodb')

const mongo = { client: null, db: null, session: null, stream: null }
if (!mongo.db && MONGO_URL) {
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
    client.connect(err => {
      if (!err) {
        console.log('MONGO CONNECTED')
        mongo.db = client.db()
        mongo.session = client.startSession() // for transactions
        // mongo.stream = db.db('mm').collection('exchangeUsers').watch()
        // mongo.stream.on('change', (change) => {
        //   console.log(change); // You could parse out the needed info and send only that data.
        //   // use websocket to listen to changes
        // })
      }
      else console.log('MONGO', err)
    })
  } catch (e) { console.log('mongo', e) }
}

module.exports = mongo

// USAGE:
// const mongo = require('<RELATIVE PATH TO>/mongo')
// await mongo.db.collection('users').findOne({ email: email })
