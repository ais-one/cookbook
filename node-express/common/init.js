'use strict'

module.exports = function(app, express, options) {
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
    .then(data => (!args[1].headersSent) && args[1].status(500).json(data || { 'error-route': args[0].originalUrl })) // we return an error still
    .catch(args[2]) //  proceed to error handler

  process.on('unhandledRejection', (reason, promise) => {
    console.log('UNHANDLED Rejection:', reason.stack || reason)
    // Recommended: send info to sentry.io or crash reporting service
  })

  // comment below and application will crash
  process.on('uncaughtException', async (err) => {
    console.log(`UNCAUGHT Exception: ${err}`)
    // setTimeout(() => {
    //   process.nextTick(() => {
    //     console.log('exiting11111')
    //     process.stderr.write('really good bye')
    //     // process.exit(1)
    //   })
    // }, 3000)

    // process.stderr.write('bye bye 2', () => {
    // })

    // process.nextTick(() => {
    //   console.log('exiting11111')
    //   console.log('exiting22222')
    //   console.log('exiting33333')
    //   setTimeout(() => {
    //     process.stderr.write('really good bye', () => {
    //       process.exit(1)
    //     })
    //   }, 3000)
    // })
  })

  const { STACK_TRACE_LIMIT = 1 } = options
  Error.stackTraceLimit = STACK_TRACE_LIMIT // limit error stack trace to 1 level

  let Sentry
  const { SENTRY_DSN, SENTRY_SAMPLE_RATE, SENTRY_REQOPTS } = global.CONFIG
  if (SENTRY_DSN) {
    Sentry = require('@sentry/node')
    const Tracing = require("@sentry/tracing")
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }), // enable HTTP calls tracing
        new Tracing.Integrations.Express({ app }), // enable Express.js middleware tracing
        // new Sentry.Integrations.OnUncaughtException({onFatalError: (e) => {
        //   Sentry.captureMessage('BIG Problem')
        //   // captureException
        //   // console.log('asdbsdghasdgkhsagdkhagsdjaghsdsjad', e)
        //   process.exit(1)
        // }}),
        // new Sentry.Integrations.OnUncaughtException({ onFatalError: () => { /** your implementation */ } }),
        // new Sentry.Integrations.OnUnhandledRejection({ onFatalError: () => { /** your implementation */ } }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring. We recommend adjusting this value in production
      tracesSampleRate: SENTRY_SAMPLE_RATE,
      environment: process.env.NODE_ENV,
    })
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler(SENTRY_REQOPTS))
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler())
    // app.use(Sentry.Handlers.errorHandler({ // by default Sentry handles 500 errors
    //   shouldHandleError(error) {
    //     return error.status >= 500 ? true : false
    //   }
    // }))
  }
  return Sentry
}