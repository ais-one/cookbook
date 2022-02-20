'use strict'

const router = require('express').Router()

// TBD Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/oidc', require('./oidc')),
    router.use('/oauth', require('./oauth')),
    router.use('/saml', require('./saml')),
    router.use('/sse', require('./sse')),
    router.use('/t4t', require('./t4t')),
    router.use('/webpush', require('./webpush')),
    router.use('/fido', require('./fido')),
  )

  const { APP_NAME } = process.env
  if (APP_NAME) require(`../apps/${APP_NAME}/routes`)(app)
  
  app.use('/api/**', (req, res) => res.status(404).json({error: 'Not Found'}))
}
