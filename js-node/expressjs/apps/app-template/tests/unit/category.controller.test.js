const httpMocks = require('node-mocks-http')
const newCategory = require('../mock-data/new-category.json')

let services
let createdCategoryId
let CategoryController
let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = null // jest.fn()
})
beforeAll(async () => {
  // const { exit } = require('process')
  const path = require('path')
  require('dotenv').config() // load
  const { APP_NAME } = process.env
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env'), override: true } )
  require('dotenv').config({ path: path.join(process.cwd(), 'apps', APP_NAME, '.env.secret'), override: true } )

  await require('@es-labs/node/config')(process.cwd())

  services = require(`../../services`)
  await services.start()

  CategoryController = require('../../controllers/category')
})
afterAll(async () => {
  await services.stop()
})

describe('CategoryController.create', () => {
  beforeEach(() => {
    req.body = newCategory
  })
  it('should have CategoryController.create()', () => {
    expect(typeof CategoryController.create).toBe('function')
  })
  it('should return 201 response code and created data JSON in body', async () => {
    await CategoryController.create(req, res)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    try {
      createdCategoryId = res._getJSONData().id
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

describe('CategoryController.findOne', () => {
  it('should have CategoryController.findOne()', () => { // function exists
    expect(typeof CategoryController.findOne).toBe('function')
  })
  // cannot test Model
  it('should return status 200 and JSON body', async () => { // 200
    req.params.id = createdCategoryId
    await CategoryController.findOne(req, res)
    expect(res.statusCode).toBe(200)
    // expect(res._isEndCalled()).toBeTruthy()
    // expect(typeof res._getJSONData()).toBe('object')
  })
  it('should return 404 if id does not exist', async () => { // 404
    req.params.id = 0
    await CategoryController.findOne(req, res)
    // expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
  // 500 error not able to cover?
})

describe('CategoryController.update', () => {
  it('should have CategoryController.update()', () => {
    expect(typeof CategoryController.update).toBe('function')
  })
  it('should return a response with json data and http code 200', async () => {
    req.params.id = createdCategoryId
    req.body = { name: 'CatA' }
    await CategoryController.update(req, res)
    expect(res.statusCode).toBe(200)
    // expect(res._isEndCalled()).toBeTruthy()
    // expect(res._getJSONData().name).toBe('abc')
  })
  it('should return 404 if id does not exist', async () => {
    req.params.id = 0
    req.body = { name: 'CatB' }
    await CategoryController.update(req, res)
    expect(res.statusCode).toBe(404)
    // expect(res._isEndCalled()).toBeTruthy()
  })
  // 500 error not able to cover?
})

describe('CategoryController.remove', () => {
  it('should have a CategoryController.remove function', () => {
    expect(typeof CategoryController.remove).toBe('function')
  })
  it('should return status 200', async () => {
    req.params.id = createdCategoryId
    await CategoryController.remove(req, res)
    expect(res.statusCode).toBe(200)
    // expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return 404 if id does not exist', async () => { // 404
    req.params.id = 0
    await CategoryController.remove(req, res)
    expect(res.statusCode).toBe(404)
    // expect(res._isEndCalled()).toBeTruthy()
  })
  // 500 error not able to cover?
})

describe.only('CategoryController.find', () => {
  it('should have a get function', () => {
    expect(typeof CategoryController.find).toBe('function')
  })
  it('should return status 200 and authors', async () => {
    await CategoryController.find(req, res)
    expect(res.statusCode).toBe(200)
    // expect(res._isEndCalled()).toBeTruthy()
    // expect(res._getJSONData().total).toBeDefined
    // console.log(res._getJSONData())
  })
  // 500 error not able to cover?
})

describe('Category Unit Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})

/* NOSONAR
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
