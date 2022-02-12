'use strict'
let Sentry

module.exports = function(app) {
  const { SENTRY_DSN, SENTRY_SAMPLE_RATE, SENTRY_REQOPTS } = process.env
  if (SENTRY_DSN && !Sentry) {
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
    app.use(Sentry.Handlers.requestHandler(JSON.parse(SENTRY_REQOPTS || null)))
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler())
    // app.use(Sentry.Handlers.errorHandler({ shouldHandleError(error) { return error.status >= 500 ? true : false } })) // by default Sentry handles 500 errors
  }
  return Sentry
}
