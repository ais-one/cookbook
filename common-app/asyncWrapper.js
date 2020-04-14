"use strict"

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

global.asyncWrapper = fn => (...args) => fn(...args)
  .then(data => (!args[1].headersSent) ? args[1].status(200).json(data || {}) : '')
  .catch(args[2]) //  proceed to error handler

// USAGE:
// const wrap = require('./<path-to>/asyncWrapper')
// app.get('/', wrap(async (req, res) => { ... }))
