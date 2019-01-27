// const ObjectID = require('mongodb').ObjectID
let mongo

console.log('MONGO_URL', process.env.MONGO_URL) // TBD: if undefined?

if (!mongo && process.env.MONGO_URL) {
  try {
    const url = process.env.MONGO_URL
    const MongoClient = require('mongodb').MongoClient
    // (async function() {
    mongo = new MongoClient(url, {
      // auth: { user: 'test', password: 'test123' },
      // authMechanism: authMechanism,
      useNewUrlParser: true
      // uri_decode_auth: true
      // reconnectTries: Infinity,
      // poolSize: 10
      // reconnectInterval
    })
    // try { await mongo.connect() } catch (e) { }
    mongo.connect(function (err) { if (err) console.log('mongo error', err) })
    // })()
  } catch (e) { console.log('mongo', e) }
}

module.exports = mongo
// {
//   mongo,
//   ObjectID: require('mongodb').ObjectID
// }
