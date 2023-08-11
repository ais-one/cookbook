
async function doMigrate(migrateName, knex) {
  const { up, down } = require('./' + migrateName)
  try {
    await down(knex)
  } catch (e) {
    console.log('down', migrateName, e.toString())
  }
  try {
    await up(knex)
  } catch (e) {
    console.log('up', migrateName, e.toString())
  }
}

const path = require('path')
require('dotenv').config()
const { APP_NAME } = process.env
require('dotenv').config({ path: path.join('apps', APP_NAME, '.env'), override: true } ) // from from project root

async function run() {
  await require('@es-labs/node/config')( process.cwd() )
  // console.log('Test Env JSON', process.env.MONGO_OPTIONS) && process.exit(0)

  try {
    const StoreKnex = require('@es-labs/node/services/db/knex') 
    const sqldb = new StoreKnex()
    await sqldb.open()
    const knex = sqldb.get()

    await doMigrate('20180927133438_create_users', knex)
    await doMigrate('20181022165031_create_test', knex)

    await sqldb.close()
    process.exit(0)
  } catch (e) {
    console.log(e.toString())
    process.exit(1)
  }
}

run()