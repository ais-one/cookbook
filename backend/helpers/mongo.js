// const ObjectID = require('mongodb').ObjectID
let mongo

console.log('MONGO_URL', process.env.MONGO_URL)

if (!mongo) {
  const dbName = 'ssntest'
  const user = encodeURIComponent('test')
  const password = encodeURIComponent('test123')
  const authMechanism = 'SCRAM-SHA-1' // 'DEFAULT'
  const host = 'ds119164.mlab.com:19164'
  const url = `mongodb://${user}:${password}@${host}/${dbName}?authMechanism=${authMechanism}&authSource=${dbName}`
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
}

module.exports = mongo
// {
//   mongo,
//   ObjectID: require('mongodb').ObjectID
// }
