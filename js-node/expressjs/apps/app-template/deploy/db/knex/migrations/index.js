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

async function run() {
  try {
    require('@es-labs/node/config')(process.cwd()) //  first thing to include
    const StoreKnex = require('@es-labs/node/services/db/knex') 
    const sqldb = new StoreKnex()
    await sqldb.open()
    // const sqldb = await require('@es-labs/node/services/db/knex').open()
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