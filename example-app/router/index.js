'use strict'

const router = require('express').Router()

// TBD Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/saml', require('./saml')),
    router.use('/oidc', require('./oidc')),
    router.use('/mongo-demo', require('./mongo-demo')),
    router.use('/t4t', require('./t4t')),
    router.use('/webpush', require('./webpush')),
    router.use('/nexmo', require('./nexmo'))
  )

  const { KNEXFILE } = global.CONFIG
  if (KNEXFILE) {
    app.use('/api',
      router.use('/authors', require('./authors')),
      router.use('/books', require('./books')),
      router.use('/categories', require('./categories')),
      router.use('/pages', require('./pages')),
    )
  }

  app.use('/api/**', (req, res) => res.status(404).json({error: 'Not Found'}))
}
