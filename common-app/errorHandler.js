// global error handler
const  { NODE_ENV } = require('./config')

Error.stackTraceLimit = 1 // limit error stack trace to 1 level

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// 200s should not reach here
const errorMap = {
  'Bad Request': 400,
  'Unauthorized': 401,
  'Forbidden': 403,
  'Not Found': 404,
  'Conflict': 409,
  'Unprocessable Entity': 422
}

module.exports = function (app) {
  app.use(function (error, req, res, next) {
    // console.log('message', error.message)
    // console.log('name', error.name)
    // console.log('stack', error.stack)
    const body = {
      error: 'Unknown Error',
      trace: null
    }
    let statusCode = 500
    if (error instanceof Error || error.code) { // error.code is custom error class, which has property code
      statusCode = error.code || errorMap[error.message] || 500
      body.error =  error.message
      if (NODE_ENV === 'development') body.trace = error.stack
    }
    res.status(statusCode).json(body)
  })
}

