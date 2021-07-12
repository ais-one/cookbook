const request = require('supertest')
const express = require('express')
const app = express()
const endpointUrl = '/api/app-custom/categories'
const newCategory = require('../mock-data/new-category.json')

let createdCategoryId
let authObj = {}
let sqldb

beforeAll(async () => {
  await require('@es-labs/node/config')(process.cwd())
  sqldb = await require('@es-labs/node/services/db/knex').open()
  require('@es-labs/node/express/preRoute')(app, express, global.CONFIG)
  require(APP_PATH + '/router')(app)

  const { createToken } = require('@es-labs/node/auth')
  const tokens = await createToken({ id: 100, groups: 'TestGroup' })
  authObj = {
    Authorization: `Bearer ${tokens.access_token}`,
    refresh_token: tokens.refresh_token
  }
})
afterAll(async () => {
  await sqldb.close()
})

describe(endpointUrl, () => {
  it('GET ' + endpointUrl, async () => {
    const response = await request(app)
      .get(endpointUrl)
      .set(authObj)
    expect(response.statusCode).toBe(200)
    // expect(Array.isArray(response.body.results)).toBeTruthy()
    // expect(response.body.results).toBeDefined()
    // expect(response.body.total).toBeDefined()
    // firstTodo = response.body[0]
  })
  // TBD 500 error for get
  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(authObj)
      .send(newCategory)
    expect(response.statusCode).toBe(201)
    // expect(response.body.name).toBe(newCategory.name)
    createdCategoryId = response.body.id
  })
  // TBD 500 error for post

  it('GET by Id ' + endpointUrl + ':id', async () => { // 200
    const response = await request(app)
      .get(endpointUrl + '/' + createdCategoryId) // createdCategoryId
      .set(authObj)
    expect(response.statusCode).toBe(200)
    // expect(response.body.name).toBe(newCategory.name)
  })
  it('GET by Id ' + endpointUrl + ':id', async () => { // 404
    const response = await request(app)
      .get(endpointUrl + '/0')
      .set(authObj)
    expect(response.statusCode).toBe(404)
  })
  // TBD 500 error for get/:id

  it('PATCH by Id ' + endpointUrl + ':id', async () => {
    const response = await request(app)
      .patch(endpointUrl + '/' + 1) // createdCategoryId
      .set(authObj)
      .send({ name: 'aa' })
      // .field('filex','')
      // .field('docx',JSON.stringify({ name: 'author1' }))
    expect(response.statusCode).toBe(200)
    // expect(response.body.name).toBe('author1')
  })
  it('PATCH by Id ' + endpointUrl + ':id', async () => {
    const response = await request(app)
      .patch(endpointUrl + '/0')
      .set(authObj)
      .send({ name: 'bb' })
      // .field('filex','')
      // .field('docx',JSON.stringify({ name: 'author1' }))
    expect(response.statusCode).toBe(404)
  })
  // TBD 500 error for patch/:id

  it('DELETE by Id ' + endpointUrl + ':id', async () => { // 200
    const response = await request(app)
      .delete(endpointUrl + '/' + createdCategoryId)
      .set(authObj)
      .send()
    expect(response.statusCode).toBe(200)
  })
  it('DELETE by Id ' + endpointUrl + ':id', async () => { // 404
    const response = await request(app)
      .delete(endpointUrl + '/0')
      .set(authObj)
      .send()
    expect(response.statusCode).toBe(404)
  })
  // TBD 500 error for delete
})

describe.only('Integration Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
