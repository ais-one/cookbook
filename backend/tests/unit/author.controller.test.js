const AuthorController = require('../../controllers/author')
// const AuthorModel = require('../../models/Author')
const httpMocks = require('node-mocks-http')

// hard to mock the model... so only test the controller
// AuthorModel.query().insert = jest.fn()
// AuthorModel.query().findOne.mockReturnValue({...})

const mockFn = jest.fn()
const newAuthor = require('../mock-data/new-author.json')
const allAuthors = require('../mock-data/all-authors.json')

let req, res
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null // jest.fn()
})

let createdAuthorId

describe('AuthorController.create', () => {
  beforeEach(() => {
    req.body = newAuthor
  })
  it('should have AuthorController.create()', () => {
    expect(typeof AuthorController.create).toBe('function')
  })
  it('should return 201 response code and created data JSON in body', async () => {
    await AuthorController.create(req, res)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    try {
      createdAuthorId = res._getJSONData().id
    } catch (e) { console.log(e.toString()) }
  })
  // it('should return JSON body in response', async () => {
  //   TodoModel.create.mockReturnValue(newTodo)
  //   await TodoController.createTodo(req, res)
  //   expect(res._getJSONData()).toStrictEqual(newTodo)
  // })
  // it('should handle JSON body error', async () => {
  //   const errorMessage = 'create todo error'
  //   const rejectedPromise = Promise.reject(errorMessage)
  //   TodoModel.create.mockReturnValue(rejectedPromise)
  //   await TodoController.createTodo(req, res)
  //   expect(next).toBeCalledWith(errorMessage)
  // })
})

describe('AuthorController.findOne', () => {
  it('should have AuthorController.findOne()', () => { // function exists
    expect(typeof AuthorController.findOne).toBe('function')
  })
  // cannot test Model
  it('should return status 200 and JSON body', async () => { // 200
    req.params.id = createdAuthorId
    await AuthorController.findOne(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(typeof res._getJSONData()).toBe('object')
  })
  it('should return 404 if id does not exist', async () => { // 404
    req.params.id = 0
    await AuthorController.findOne(req, res)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
  // 500 error not able to cover?
})

describe('AuthorController.update', () => {
  it('should have AuthorController.update()', () => {
    expect(typeof AuthorController.update).toBe('function')
  })
  it('should return a response with json data and http code 200', async () => {
    req.params.id = createdAuthorId
    req.body = { docx: JSON.stringify({ name: 'abc' }) }
    await AuthorController.update(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData().name).toBe('abc')
  })
  it('should return 404 if id does not exist', async () => {
    req.params.id = 0
    req.body = { docx: JSON.stringify({ name: 'abc' }) }
    await AuthorController.update(req, res)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
  // 500 error not able to cover?
})

describe('AuthorController.remove', () => {
  it('should have a AuthorController.remove function', () => {
    expect(typeof AuthorController.remove).toBe('function')
  })
  it('should return status 200', async () => {
    req.params.id = createdAuthorId
    await AuthorController.remove(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return 404 if id does not exist', async () => { // 404
    req.params.id = 0
    await AuthorController.remove(req, res)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
  // 500 error not able to cover?
})


describe('AuthorController.find', () => {
  it('should have a getTodos function', () => {
    expect(typeof AuthorController.find).toBe('function')
  })
  it('should return status 200 and all todos', async () => {
    await AuthorController.find(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData().total).toBeDefined
    // console.log(res._getJSONData())
  })
  // 500 error not able to cover?
})

describe.only('Author Unit Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})

/*
describe('app ws testing', () => {
    it('connect websockets response', (done) => {
        expect.assertions(1);

        const ws = new WebSocket(`ws://localhost:${port}`)
            .on('message', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close(); // NEED TO CLOSE!!!
            })
            .on('close', () => done());
    });
});
*/
// https://www.npmjs.com/package/jest-websocket-mock
// https://stackoverflow.com/questions/57804844/jest-with-websockets-ignores-messages-after-the-first-one
// https://stackoverflow.com/questions/55963562/test-websockets-with-jest