const router = require('express').Router()

// TBD Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/authors', require('./authors')),
    router.use('/books', require('./books')),
    router.use('/categories', require('./categories')),
    router.use('/pages', require('./pages')),
    // require('./page'),
    router.use('/mongo-demo', require('./mongo-demo')),
    router.use('/t4t', require('./t4t')),
    router.use('/webpush', require('./webpush'))
  )
}