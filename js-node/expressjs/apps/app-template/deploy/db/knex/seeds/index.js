async function doSeed(seedName, knex) {
  const { seed } = require('./' + process.env.NODE_ENV + '/' + seedName)
  await seed(knex)
}

async function run() {
  try {
    require('@es-labs/node/config')(process.cwd()) //  first thing to include
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