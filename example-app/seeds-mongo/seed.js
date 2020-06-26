const { MONGO_DB, MONGO_URL } = require('../config')

let db
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(async err => {
  if (!err) {
    try {
      db = client.db(MONGO_DB)

      const icc = require('../seeds/icc.json')
      await db.collection('country').deleteMany({})
      await db.collection('country').createIndex({ code: 1 }, { unique: true })
      await db.collection('country').insertMany(icc)

      await db.collection('person').deleteMany({})
      await db.collection('person').createIndex({ firstName: 1, lastName: 1 }, { unique: true })

      client.close()
      process.exit(0)
    } catch (e) {
      console.log(e.toString())
      process.exit(1)
    }
  }
  else {
    console.log(err)
  }
})

// db.getCollection('job').aggregate( [ { $group : { _id : "$operatorCode", count: { $sum: 1 } } } ] )