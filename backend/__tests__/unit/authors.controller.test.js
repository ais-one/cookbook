/*
const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')

const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')
// Either Mock or Spy...

// Mock
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();
// can replace all the boiler plate above
// jest.mock('../../model/todo.model') // must use URL

let req, res, next

const todoId = '5e2e8a4324bbc8137074a8de'

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn() // null
})

describe('TodoController.deleteTodo', () => {
  it('should have a deleteTodo function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function')
  })
  it('should delete with TodoModel.findByIdAndDelete', async () => {
    req.params.todoId = todoId
    await TodoController.deleteTodo(req, res, next)
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId)
  })
  it('should return 200 OK and deleted TodoModel', async () => {
    req.params.todoId = todoId

    TodoModel.findByIdAndDelete.mockReturnValue(newTodo)
    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)

    await TodoController.deleteTodo(req, res, next)
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId)
  })

  it('should handle deleteTodo error', async () => {
    const errorMessage = 'findByIdAndDelete todo error'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
    // req.params.todoId = '5e2e8a4324bbc8137074a8de'
    await TodoController.deleteTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
  it('should return 404 if item does not exist for deleteTodo', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null)
    await TodoController.deleteTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
})

describe('TodoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function')
  })
  it('should update with TodoModel.findByIdAndUpdate', async () => {
    req.params.todoId = todoId
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    // TodoModel.findByIdAndUpdate(todoId, newTodo, {
    //   new: true,
    //   useFindAndModify: false
    // })
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false
    })
  })
  it('should return a response with json data and http code 200', async () => {
    req.params.todoId = todoId
    req.body = newTodo
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle updateTodo error', async () => {
    const errorMessage = 'findByIdAndUpdate todo error'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
    // req.params.todoId = '5e2e8a4324bbc8137074a8de'
    await TodoController.updateTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
  it('should return 404 if item does not exist for updateTodo', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null)
    await TodoController.updateTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
})

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById function', () => {
    expect(typeof TodoController.getTodoById).toBe('function')
  })
  it('should call TodoModel.findById with route parameters', async () => {
    req.params.todoId = todoId
    await TodoController.getTodoById(req, res, next)
    expect(TodoModel.findById).toBeCalledWith(todoId)
  })
  it('should return status 200 and JSON body', async () => {
    TodoModel.findById.mockReturnValue(newTodo)
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle getTodoById error', async () => {
    const errorMessage = 'findById todo error'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findById.mockReturnValue(rejectedPromise)
    // req.params.todoId = '5e2e8a4324bbc8137074a8de'
    await TodoController.getTodoById(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
  it('should return 404 if item does not exist for getTodoById', async () => {
    TodoModel.findById.mockReturnValue(null)
    // req.params.todoId = '5e2e8a4324bbc8137074a8de'
    await TodoController.getTodoById(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
  })
})

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function')
  })
  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next)
    expect(TodoModel.find).toBeCalledWith({})
  })
  it('should return status 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos)
    await TodoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(allTodos)
  })
  it('should handle getTodos error', async () => {
    const errorMessage = 'find todo error'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.find.mockReturnValue(rejectedPromise)
    await TodoController.getTodos(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo
  })

  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })
  it('should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next)
    // expect(TodoModel.create).toBeCalled()
    expect(TodoModel.create).toBeCalledWith(newTodo)
  })
  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return JSON body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo)
    await TodoController.createTodo(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle JSON body error', async () => {
    const errorMessage = 'create todo error'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.create.mockReturnValue(rejectedPromise)
    await TodoController.createTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})
*/

describe('Unit Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
