require(require('path').join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH

const { MONGO_DB, MONGO_URL } = global.CONFIG
const { JWT_REFRESH_STORE, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE_NAME } = global.CONFIG

const ObjectID = require('mongodb').ObjectID

let db
const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(async err => {
  if (!err) {
    try {
      db = client.db(MONGO_DB)

      // Create JWT User Session Store
      if (JWT_REFRESH_STORE === 'mongo') {
        await db.collection(JWT_REFRESH_STORE_NAME).deleteMany({})
        await db.collection(JWT_REFRESH_STORE_NAME).createIndex({ id: 1 }, { unique: true })
        await db.collection(JWT_REFRESH_STORE_NAME).createIndex( { setAt: 1 }, { expireAfterSeconds: JWT_REFRESH_EXPIRY } )  
      }

      await db.collection('country').deleteMany({})
      await db.collection('country').createIndex({ code: 1 }, { unique: true })
      await db.collection('country').createIndex({ name: 1 }, { unique: true })
      await db.collection('country').insertMany(require('../icc.json'))

      await db.collection('state').deleteMany({})
      await db.collection('state').createIndex({ country_name: 1, code: 1 }, { unique: true })
      await db.collection('state').createIndex({ country_name: 1 })
      await db.collection('state').insertMany(require('../state.json'))

      await db.collection('person').deleteMany({})
      await db.collection('person').createIndex({ firstName: 1, lastName: 1 }, { unique: true })
      let rv = await db.collection('person').insertOne({
        firstName: 'first',
        lastName: 'last',
        sex: 'M',
        subjects: 'EM,PHY',
        age: 1,
        gpa: 0,
        birthDate: '',
        birthTime: '',
        country: 'SG',
        birthDateTimeTz: null,
        website: '',
        remarks: '',
        updated_by: 'someone',
        updated_at: new Date()  
      })

      // rv.insertedId, rv.result.ok
      const personIdStr = rv.insertedId

      await db.collection('grade').deleteMany({})
      await db.collection('grade').createIndex({ personId: 1 })
      await db.collection('grade').insertMany([
        { personId: personIdStr, subject: 'EM', grade: '80' },
        { personId: personIdStr, subject: 'AM', grade: '90' },
        { personId: personIdStr, subject: 'PHY', grade: '70' }
      ])

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

