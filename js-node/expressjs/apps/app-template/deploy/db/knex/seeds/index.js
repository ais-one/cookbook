async function doSeed(seedName, knex) {
  const { seed } = require('./' + process.env.NODE_ENV + '/' + seedName)
  await seed(knex)
}

const path = require('path')
require('dotenv').config()
const { APP_NAME } = process.env
require('dotenv').config({ path: path.join('apps', APP_NAME, '.env'), override: true } ) // from from project root

async function run() {
  try {
    await require('@es-labs/node/config')( process.cwd() )
    // console.log('Test Env JSON', process.env.MONGO_OPTIONS) && process.exit(0)
  
    const StoreKnex = require('@es-labs/node/services/db/knex') 
    const sqldb = new StoreKnex()
    await sqldb.open()
    // const sqldb = await require('@es-labs/node/services/db/knex').open()
    const knex = sqldb.get()

    await doSeed('seed_users', knex)
    await doSeed('seed_test', knex)
 
    await sqldb.close()
    process.exit(0)
  } catch (e) {
    console.log(e.toString())
    process.exit(1)
  }
}

run()