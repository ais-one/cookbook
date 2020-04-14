// global error handler
const  { NODE_ENV } = require('./config')

Error.stackTraceLimit = 1 // limit error stack trace to 1 level

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// 200s should not reach here
const errorMap = {
  'Bad Request': 400,
  'Unauthorized': 401,
  'Forbidden': 403,
  'Not Found': 404
  // 409 Conflict
  // 422 Unprocessable Entity
}

module.exports = function (app) {
  app.use(function (error, req, res, next) {
    // if (error instanceof AssertionError) { }
    // console.log('message', error.message)
    // console.log('name', error.name)
    // console.log('stack', error.stack)
    const statusCode = errorMap[error.message] || 500

    const body = {
      error: error.message
    }
    if (NODE_ENV === 'development') body.trace = error.stack
    res.status(statusCode).json(body)
  })
}

