'user strict'
let sqldb

beforeAll(async () => {
  await require('@es-labs/node/config')(process.cwd())
  sqldb = await require('@es-labs/node/services/db/knex').open()
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
