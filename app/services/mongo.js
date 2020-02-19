// const ObjectID = require('mongodb').ObjectID

// reconnection
// does happen, to test out. shutdown mongo server, wait awhile then start up. CRUD will take effect and updates will take effect also...

// watch changes
// in mongo client, run rs.initiate() - but how to start mongo rs without calling this command?
// .\bin\mongod.exe --dbpath .\bin\data --port 27017 --replSet rs0

/*
// replace
{
  _id: { 
    _data: '825D07B9C7000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645CE20EDD520C352CBCF453E80004'
  },
  operationType: 'replace',
  clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787399 },
  fullDocument: {
    _id: 5ce20edd520c352cbcf453e8,
    username: 'user5a',
    email: 'user5',
    clientId: '5c9b1eb8cb3521eccb35431b',
    password: '$2a$12$1K.MWGt6Ez30WJ05mYAK6u/dvjoce0O.IATL2TYxLGxCv2rju9ccS',
    gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
    sms: '',
    smsLastSent: null,
    smsOtpPin: '',
    smsVerified: 0,
    telegramId: '',
    telegramUsername: '',
    role: 'user'
  },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5ce20edd520c352cbcf453e8 }
}

// insert
{ _id:
   { _data:
      '825D07BBBC000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645D07BBBCCAABD31DCDB648950004' },
  operationType: 'insert',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787900 },
  fullDocument:
   { _id: 5d07bbbccaabd31dcdb64895,
     username: 'user6aa',
     email: 'user6aa',
     clientId: '5c9b1eb8cb3521eccb35431b',
     password:
      '$2a$12$1K.MWGt6Ez30WJ05mYAK6u/dvjoce0O.IATL2TYxLGxCv2rju9ccS',
     gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
     sms: '',
     smsLastSent: null,
     smsOtpPin: '',
     smsVerified: 0,
     telegramId: '',
     telegramUsername: '',
     role: 'user' },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5d07bbbccaabd31dcdb64895 } }

// delete
{ _id:
   { _data:
      '825D07BBEF000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645D07BBBCCAABD31DCDB648950004' },
  operationType: 'delete',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787951 },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5d07bbbccaabd31dcdb64895 }
}

{
  "_id":{
  "_data":"825C5D51F70000000129295A1004E83608EE8F1B4FBABDCEE73D5BF31FC946645F696400645C5D51F73ACA83479B48DE6E0004"},
  "operationType":"insert",
  "clusterTime":"6655565945622233089",
  "fullDocument":{
  "_id":"5c5d51f73aca83479b48de6e",
  "ticker":"AAPL",
  "Price":300
  },
  "ns":{"db":"mydb","coll":"Stocks"},
  "documentKey":{"_id":"5c5d51f73aca83479b48de6e"}
}
*/
const { MONGO_URL } = require('../'+ require('../appname') + '/config')
const { MongoClient } = require('mongodb')

const mongo = { db: null, stream: null }
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
    client.connect(err => {
      if (!err) {
        console.log('MONGO CONNECTED')
        mongo.db = client.db()
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
