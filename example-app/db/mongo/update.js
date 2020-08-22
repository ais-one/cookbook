require(require('path').join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH
const { MONGO_DB, MONGO_URL, JWT_REFRESH_STORE_NAME, JWT_REFRESH_STORE, JWT_REFRESH_EXPIRY } = global.CONFIG
// console.log(MONGO_DB, MONGO_URL, JWT_REFRESH_STORE,JWT_REFRESH_EXPIRY)

const ObjectID = require('mongodb').ObjectID

const bcrypt = require('bcryptjs')

const WINDOW_SIZE = 100 // update batch window size

let db
const MongoClient = require('mongodb').MongoClient
const uri = MONGO_URL
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(async err => {
  if (!err) {
    try {
      db = client.db(process.env.MONGO_DB)

      // Create JWT User Session Store
      // if (JWT_REFRESH_STORE === 'mongo') {
      //   await db.collection(JWT_REFRESH_STORE_NAME).deleteMany({})
      //   await db.collection(JWT_REFRESH_STORE_NAME).createIndex({ id: 1 }, { unique: true })
      //   await db.collection(JWT_REFRESH_STORE_NAME).createIndex( { setAt: 1 }, { expireAfterSeconds: JWT_REFRESH_EXPIRY } )  
      // }

      // job
      // operation - rename field
      // await db.collection('job').updateMany({}, { $rename: { 'customerCode': 'agencyCode' } } )
      await db.collection('job').updateMany({}, { $rename: { 'contactInfo': 'agentMobile' } } )

      // operation - set agencyCode from CASH to None
      // await db.collection('job').updateMany( { agencyCode: 'CASH' }, { $set: { agencyCode: 'None' } } )
      // operation - add new field jobCat
      // await db.collection('job').updateMany({}, { $set: { jobCat: 'Launch' } })

      // user
      // operation change cat Agent to Agency
      // await db.collection('user').updateMany( { cat: 'Agent' }, { $set: { cat: 'Agency' } } )

      // const count = await db.collection('user').find().count()
      // console.log('collection count', count)
      // const pages = parseInt(Math.ceil(count / WINDOW_SIZE))
      // for (i = 0; i<pages; i++) {
      //   const rv = await db.collection(coll).find().skip(parseInt(i) * parseInt(WINDOW_SIZE)).limit(parseInt(WINDOW_SIZE)).toArray()
      //   // console.log(rv)
      //   for (let item of rv) {
      //     await db.collection(coll).updateOne(
      //       { _id: new ObjectID(item._id) },
      //       {
      //         $set: {
      //           // shortId: parseInt(Date.parse(item.createdAt) / 1000).toString().slice(-6)
      //           // timeStamp: (new Date(`${item.timeStamp} +0800`)).toISOString()
      //           pin: bcrypt.hashSync(String(item.pin), 12)
      //         }
      //       }
      //     )
      //   }
      // }

      // await db.collection('user').find({}).forEach( async function (i) {
      //   try {
      //     console.log(i._id, i.pin)
      //     await db.collection('user').updateOne(
      //       { _id: new ObjectID(i._id) },
      //       { $set: { pin: bcrypt.hashSync(String(i.pin), 12), oldPin: String(i.pin) } }
      //     )  
      //   } catch (e) {
      //     console.log('ineer problem', e.toString())
      //   }
      // } )

      // THIS WORKS
      // const writeOps = []
      // await db.collection('user').find({}).forEach( function (i) {
      //   writeOps.push(
      //     {
      //       updateOne: {
      //         "filter": { _id: new ObjectID(i._id) },
      //         "update": {
      //           $set: {
      //             pin: bcrypt.hashSync(String(i.pin), 12),
      //             oldPin: String(i.pin)
      //           }
      //         },
      //         "upsert" : true
      //       }
      //     }
      //   )
      // })
      // const dbRv = await db.collection('user').bulkWrite( writeOps )
      // console.log(dbRv)

      // remove a field - if needed
      // await db.collection('user').updateMany( { }, { $unset: { encpwd: '' } } )


      // -------------------------------------- operation set indexes --------------------------------------

      // await db.collection('agency').createIndex({ status: 1 })
      // await db.collection('agency').createIndex({ agencyCode: 1 }, { unique: true })
      // await db.collection('agency').createIndex({ name: 1 }, { unique: true })

      // await db.collection('job').createIndex({ agencyCode: 1 })
      // // await db.collection('job').createIndex({ operatorCode: 1 })
      // // await db.collection('job').createIndex({ orderDateTime: -1 }) // MANUAL change to -1
      // await db.collection('job').createIndex({ orderDate: -1 })

      // await db.collection('operator').createIndex({ status: 1 })
      // // await db.collection('operator').createIndex({ operatorCode: 1 }, { unique: true })
      // // await db.collection('operator').createIndex({ name: 1 }, { unique: true })

      // await db.collection('user').createIndex({ status: 1 })
      // await db.collection('user').createIndex({ customerCode: 1 }) // MANUAL remove operatorCode manually
      // await db.collection('user').createIndex({ email: 1 }, { unique: true })

      client.close()
      process.exit(0)

      // NO LONGER IN USE
      // await db.collection('mdh-snapshot').find({}).forEach( function(i){
      //   db.collection('mdh-snapshot').update(
      //     { _id: i._id },
      //       {
      //         $set: {
      //           // shortId: parseInt(Date.parse(i.createdAt) / 1000).toString().slice(-6)
      //           timeStamp: (new Date(`${i.timeStamp} +0800`)).toISOString()
      //         }
      //       }
      //   )
      // } )

    } catch (e) {
      console.log(e.toString())
      process.exit(1)
    }
  }
})
