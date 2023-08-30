'use strict'
const router = require('express').Router()

// TBD Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./base')),
    router.use('/auth', require('./auth').myauthRoute),
    router.use('/oidc', require('./auth').oidcRoute),
    router.use('/oauth', require('./auth').oauthRoute),
    router.use('/saml', require('./auth').samlRoute),
    router.use('/sse', require('./sse')),
    router.use('/t4t', require('./t4t')),
    router.use('/webpush', require('./webpush')),
    router.use('/fido', require('./fido')),
  )
}
