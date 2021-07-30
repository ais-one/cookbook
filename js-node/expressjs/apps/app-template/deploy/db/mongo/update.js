async function run() {
  try {
    require('@es-labs/node/config')(process.cwd()) //  first thing to include
    const StoreMongo = require('@es-labs/node/services/db/mongodb') 
    const mongodb = new StoreMongo()
    await mongodb.open()

    //NOSONAR // const mongo = mongodb.get()
    //NOSONAR // const ObjectID = mongo.ObjectID
    //NOSONAR // const { bcrypt } = require('@es-labs/node/auth')
    //NOSONAR // const WINDOW_SIZE = 100 // update batch window size

    // rename field
    // await mongo.db.collection('job').updateMany({}, { $rename: { 'customerCode': 'agencyCode' } } )

    // add new field jobCat
    // await mongo.db.collection('job').updateMany({}, { $set: { jobCat: 'Launch' } })

    // changing fixed value
    // await mongo.db.collection('user').updateMany( { cat: 'Agent' }, { $set: { cat: 'Agency' } } )

    // remove a field
    // await mongo.db.collection('user').updateMany( { }, { $unset: { encpwd: '' } } )

    // changing dynamic value - paged
    // const count = await mongo.db.collection('user').find().count()
    // console.log('collection count', count)
    // const pages = parseInt(Math.ceil(count / WINDOW_SIZE))
    // for (i = 0; i<pages; i++) {
    //   const rv = await mongo.db.collection(coll).find().skip(parseInt(i) * parseInt(WINDOW_SIZE)).limit(parseInt(WINDOW_SIZE)).toArray()
    //   // console.log(rv)
    //   for (let item of rv) {
    //     await mongo.db.collection(coll).updateOne(
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

    // changing dynamic value - bulkwrite (writeOps limit?)
    // const writeOps = []
    // await mongo.db.collection('user').find({}).forEach( function (i) {
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
    // const dbRv = await mongo.db.collection('user').bulkWrite( writeOps )
    // console.log(dbRv)

    // setting indexes
    // await mongo.db.collection('job').createIndex({ agencyCode: 1 })
    // // await mongo.db.collection('job').createIndex({ orderDateTime: -1 }) // MANUAL change to -1
    // await mongo.db.collection('user').createIndex({ customerCode: 1 }) // MANUAL remove operatorCode index

    await mongodb.close()
    process.exit(0)
  } catch (e) {
    console.log(e.toString())
    process.exit(1)
  }
}

run()