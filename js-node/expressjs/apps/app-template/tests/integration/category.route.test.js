const request = require('supertest')
const express = require('express')
const app = express()
const newCategory = require('../mock-data/new-category.json')

let services
let createdCategoryId
let authObj = {}
let endpointUrl

beforeAll(async () => {
  const path = require('path')
  require('dotenv').config() // load
  const { APP_NAME } = process.env
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env'), override: true } )
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env.secret'), override: true } )

  await require('@es-labs/node/config')(process.cwd())

  require(path.join(process.cwd(), 'common', 'init'))()
  require(path.join(process.cwd(), 'common', 'preRoute'))(app, express)
  process.env.WS_PORT = '' // disable websocket for now
  require(path.join(process.cwd(), 'router'))(app)

  services = require(`../../services`)
  await services.start()
  const tokens = await services.get('auth').createToken({ id: 100, groups: 'TestGroup' })

  authObj = {
    Authorization: `Bearer ${tokens.access_token}`,
    refresh_token: tokens.refresh_token
  }
  endpointUrl = `/api/${APP_NAME}/categories/categories`
})
afterAll(async () => {
  await services.stop()
})

describe.only('Testing Categories Endpoint URL', () => {
  it.only('GET categories', async () => {
    const response = await request(app)
      // .get('/api/app-template/categories/categories')
      // .get('/api/app-template/healthcheck')
      // .get('/api/healthcheck')
      .get(endpointUrl)
      .set(authObj)
    expect(response.statusCode).toBe(200)
    // expect(Array.isArray(response.body.results)).toBeTruthy()
    // expect(response.body.results).toBeDefined()
    // expect(response.body.total).toBeDefined()
    // firstTodo = response.body[0]
  })


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

describe('Integration Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
