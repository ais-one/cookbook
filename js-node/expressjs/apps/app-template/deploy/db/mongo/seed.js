async function run() {
  try {
    require('@es-labs/node/config')(process.cwd()) //  first thing to include
    const StoreMongo = require('@es-labs/node/services/db/mongodb') 
    const mongodb = new StoreMongo()
    await mongodb.open()
    const mongo = mongodb.get()

    //NOSONAR // const ObjectID = mongo.ObjectID

    // Create JWT User Session Store
    // const { JWT_REFRESH_STORE, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE_NAME } = process.env
    /*
    if (JWT_REFRESH_STORE === 'mongo') {
      await mongo.db.collection(JWT_REFRESH_STORE_NAME).deleteMany({})
      await mongo.db.collection(JWT_REFRESH_STORE_NAME).createIndex({ id: 1 }, { unique: true })
      await mongo.db.collection(JWT_REFRESH_STORE_NAME).createIndex( { setAt: 1 }, { expireAfterSeconds: JWT_REFRESH_EXPIRY } )  
    }

    await mongo.db.collection('country').deleteMany({})
    await mongo.db.collection('country').createIndex({ code: 1 }, { unique: true })
    await mongo.db.collection('country').createIndex({ name: 1 }, { unique: true })
    await mongo.db.collection('country').insertMany(require('../icc.json'))

    await mongo.db.collection('state').deleteMany({})
    await mongo.db.collection('state').createIndex({ country_name: 1, code: 1 }, { unique: true })
    await mongo.db.collection('state').createIndex({ country_name: 1 })
    await mongo.db.collection('state').insertMany(require('../state.json'))


    await mongo.db.collection('users').deleteMany({})
    await mongo.db.collection('users').createIndex({ email: 1 }, { unique: true })
    await mongo.db.collection('users').createIndex({ username: 1 }, { unique: true })
    await mongo.db.collection('users').insertOne({
      groups: 'TestGroup',
      orgId: 1,
      username: 'test',
      email: 'test',
      githubId: null,
      password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', // test
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      // smsLastSent
      // smsOtpPin
      smsVerified: 0,
      telegramId: '',
      telegramUsername: '',
      pnToken: '', // push notification token
      revoked: '', // if not empty means user has been revoked
      refreshToken: '' // to match user with refreshToken to extend access token
    })
  
    await mongo.db.collection('person').deleteMany({})
    await mongo.db.collection('person').createIndex({ firstName: 1, lastName: 1 }, { unique: true })
    let rv = await mongo.db.collection('person').insertOne({
      firstName: 'first',
      lastName: 'last',
      sex: 'M',
      subjects: 'EM,PHY',
      age: 1,
      gpa: 0,
      birthDate: '',
      birthTime: '',
      country: 'SG',
      state: '',
      birthDateTimeTz: null,
      website: '',
      remarks: '',
      updated_by: 'someone',
      updated_at: new Date()  
    })
    // rv.insertedId, rv.result.ok
    const personIdStr = rv.insertedId

    await mongo.db.collection('grade').deleteMany({})
    await mongo.db.collection('grade').createIndex({ personId: 1 })
    await mongo.db.collection('grade').insertMany([
      { personId: personIdStr, subject: 'EM', grade: '80' },
      { personId: personIdStr, subject: 'AM', grade: '90' },
      { personId: personIdStr, subject: 'PHY', grade: '70' }
    ])
    */

    await mongo.db.collection('grade-todelete').insertMany([
      { subject: 'EM', gradex: '80' },
      { subject: 'AM', gradex: '90' },
      { subject: 'PHY', gradex: '70' }
    ])

    await mongodb.close()
    process.exit(0)
  } catch (e) {
    console.log(e.toString())
    process.exit(1)
  }
}

run()
// db.getCollection('job').aggregate( [ { $group : { _id : "$operatorCode", count: { $sum: 1 } } } ] )

