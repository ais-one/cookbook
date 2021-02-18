async function doSeed(seedName, knex) {
  const { seed } = require('./' + process.env.NODE_ENV + '/' + seedName)
  await seed(knex)
}

async function run() {
  try {
    require('@es-labs/node/config')(process.cwd()) //  first thing to include
    const objection = await require('@es-labs/node/services/db/objection').open()
    const Model = objection.get()
    const knex = Model.knex()

    await doSeed('seed_users', knex)
    await doSeed('seed_test', knex)
 
    await objection.close()
    process.exit(0)
  } catch (e) {
    console.log(e.toString())
    process.exit(1)
  }
}

run()