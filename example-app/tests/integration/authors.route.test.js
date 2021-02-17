const request = require('supertest')
const express = require('express')
const app = express()

const endpointUrl = '/api/authors'

const newAuthor = require('../mock-data/new-author.json')

let createdAuthorId
let authObj = {}

/*
let firstTodo
const testData = {
  title: 'AAA',
  done: true
}
*/

describe(endpointUrl, () => {
  beforeAll(async () => {
    await require('@es-labs/node/config')(process.cwd())
    require('@es-labs/node/services/db/objection').open()
    require('../../common-express/preRoute')(app)
    require('../../router')(app)

    const { createToken } = require('@es-labs/node/auth')
    const { token } = await createToken({ id: 100, verified: true, groups: 'TestGroup' }, { expiresIn: '1d' })
    authObj = {
      Authorization: 'Bearer ' + token
    }
  })
  // afterAll(() => {
  //   objection.close()
  // })
  it.only('GET ' + endpointUrl, async () => {
    const response = await request(app)
      .get(endpointUrl)
      .set(authObj)
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.results)).toBeTruthy()
    expect(response.body.results).toBeDefined()
    expect(response.body.total).toBeDefined()
    // firstTodo = response.body[0]
  })
  // TBD 500 error for get

  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(authObj)
      .send(newAuthor)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newAuthor.name)
    createdAuthorId = response.body.id
  })
  // TBD 500 error for post

  it('GET by Id ' + endpointUrl + ':id', async () => { // 200
    const response = await request(app)
      .get(endpointUrl + '/' + 1) // createdAuthorId
      .set(authObj)
    expect(response.statusCode).toBe(200)
    // expect(response.body.name).toBe(newAuthor.name)
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
      .patch(endpointUrl + '/' + 1) // createdAuthorId
      .set(authObj)
      .field('filex','')
      .field('docx',JSON.stringify({ name: 'author1' }))
      // .attach('image1', 'path/to/felix.jpeg')
      // .attach('image2', imageBuffer, 'luna.jpeg')
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('author1')
  })
  it('PATCH by Id ' + endpointUrl + ':id', async () => {
    const response = await request(app)
      .patch(endpointUrl + '/0')
      .set(authObj)
      .field('filex','')
      .field('docx',JSON.stringify({ name: 'author1' }))
    expect(response.statusCode).toBe(404)
  })
  // TBD 500 error for patch/:id

  it('DELETE by Id ' + endpointUrl + ':id', async () => { // 200
    const response = await request(app)
      .delete(endpointUrl + '/' + createdAuthorId)
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
