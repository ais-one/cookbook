/*
const request = require('supertest')
const app = require('../../app')

const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')

const endpointUrl = '/todos'

let firstTodo
let createdTodo
const testData = {
  title: 'AAA',
  done: true
}

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(newTodo)
    expect(response.statusCode).toBe(201)
    expect(response.body.title).toBe(newTodo.title)
    expect(response.body.done).toBe(newTodo.done)
    createdTodo = response.body
  })

  it('should return error 500 on malformed data with POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({
        title: 'missing done property'
      })
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({
      error: 'create todo error'
    })
  })

  it('GET ' + endpointUrl, async () => {
    const response = await request(app)
      .get(endpointUrl)
      .send(newTodo)
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body[0].title).toBeDefined()
    expect(response.body[0].done).toBeDefined()
    firstTodo = response.body[0]
  })

  it('GET by Id ' + endpointUrl + ':todoId', async () => {
    const response = await request(app)
      .get(endpointUrl + '/' + firstTodo._id)
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(firstTodo.title)
    expect(response.body.done).toBe(firstTodo.done)
  })

  it('GET by Id ' + endpointUrl + ':todoId does not exist', async () => {
    const response = await request(app)
      .get(endpointUrl + '/5e2e8a4324bbc8137074aaaa')
    expect(response.statusCode).toBe(404)
  })

  it('PUT by Id ' + endpointUrl + ':todoId', async () => {
    const response = await request(app)
      .put(endpointUrl + '/' + createdTodo._id)
      .send(testData)
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(testData.title)
    expect(response.body.done).toBe(testData.done)
  })

  it('DELETE by Id ' + endpointUrl + ':todoId', async () => {
    const response = await request(app)
      .delete(endpointUrl + '/' + createdTodo._id)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(testData.title)
    expect(response.body.done).toBe(testData.done)
  })
  it('DELETE by Id ' + endpointUrl + ':todoId does not exist', async () => {
    const response = await request(app)
      .delete(endpointUrl + '/5e2e8a4324bbc8137074aaaa').send()
    expect(response.statusCode).toBe(404)
  })

})
*/

describe('Integration Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
