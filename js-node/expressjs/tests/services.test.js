
'use strict'
let sqldb

beforeAll(async () => {
  const path = require('path')
  require('dotenv').config() // load
  const { APP_NAME } = process.env
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env'), override: true } )
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env.secret'), override: true } )

  await require('@es-labs/node/config')(process.cwd())
  const StoreKnex = require('@es-labs/node/services/db/knex') 
  sqldb = new StoreKnex()
  await sqldb.open()
})
afterAll(async () => {
  await sqldb.close()
})  

describe('Test Services', () => {
  it('Test Knex', async () => {
    let knex = sqldb.get()
    const rv = ( await knex('users').where({ username: 'ais-one' }).first() ).githubId
    expect(rv).toStrictEqual(4284574)
  })
})

describe('Services Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
