'use strict'

module.exports = function ({ unhandledRejection, uncaughtException, stackTraceLimit=10 }) {
  // set globals here
  // caution - avoid name clashes with native JS libraries, other libraries, other globals

  // 1. asyncWrapper
  // https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
  // https://gist.github.com/Hiswe/fe83c97d1c7c8eee9557939d1b9bc086

  // Caveats:
  // 1. You must have all your asynchronous code return promises (except emitters). Raw callbacks simply don’t have the facilities for this to work.
  // 2. Event emitters (like streams) can still cause uncaught exceptions. So make sure you are handling the error event properly e.g. stream.on('error', next).pipe(res)

  // DOs:
  // DO use throw, and try/catch when needed
  // DO use custom error classes like BadRequestError as it makes sorting errors out easier

  // make a closure to keep a reference to our original async function
  // function asyncWrapper(asyncRouteHandler) {
  //   // this is what will be called by express.js
  //   return function routeHandler(request, response, next) {
  //     // because it's an async function it will always return a promise
  //     // – just call it with express' callback parameters
  //     return (
  //       asyncRouteHandler(request, response, next)
  //         // catch any error that might happen in our async function
  //         .catch(next)
  //     )
  //   }
  // }

  // OR:

  // thanks to arrow functions and params destructuring
  // we can write it that way:
  // const asyncWrapper = fn => (...args) => fn(...args).catch(args[2])
  // module.exports = asyncWrapper

  // USAGE:
  // const wrap = require('./<path-to>/asyncWrapper')
  // app.get('/', wrap(async (req, res) => { ... }))

  global.asyncWrapper = fn => (...args) => fn(...args)
    .then(data => (!args[1].headersSent) ? args[1].status(200).json(data || {}) : '')
    .catch(args[2]) //  proceed to error handler

  // 2. Custom Errors - HTTP
  // TBD
  //
  // class NotFoundError extends Error {
  //   constructor(message) {
  //     super(message)
  //     this.name = "NotFoundError"
  //     this.code = 404
  //   }
  // }
  // global.NotFoundError = NotFoundError

  // format the JS Error Object
  global.errorFormatHttp = (e, code) => { // code is http status code
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    const errorMap = {
      'Bad Request': 400,
      'Unauthorized': 401,
      'Forbidden': 403,
      'Not Found': 404,
      'Conflict': 409,
      'Unprocessable Entity': 422,
      'Internal Server Error': 500,
    }
    if (code === undefined) {
      code = e.message ? errorMap[e.message] || 500 : 500
    }

    if (e instanceof Error) {
      // console.log('Error Object', error.name, error.name, error.stack)
      let message = (e.name || '') + (e.message || e.toString() || 'Unknown Error')
      let body = { message, code }
      if (process.env.NODE_ENV === 'development') {
        body.message = e.stack || message
      }
      return body  
    } 
    return { message: e.toString() || 'Unknown Error', code } // fallback
  }

  process.on('unhandledRejection',
    unhandledRejection ?
    unhandledRejection :
    (reason, promise) => {
      console.log('Unhandled Rejection at:', reason.stack || reason)
      // Recommended: send the information to sentry.io
      // or whatever crash reporting service you use
    }
  )

  // comment below and application will crash
  process.on('uncaughtException', 
    uncaughtException ?
    uncaughtException :
    err => {
      console.log('If you do not process uncaughtException, application will crash')
      console.log(`Uncaught Exception: ${err.message}`)
      // process.exit(1) // force it to crash anyway
    }
  )

  Error.stackTraceLimit = stackTraceLimit // limit error stack trace to 1 level
}