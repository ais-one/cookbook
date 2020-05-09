const router = require('express').Router()

// TBD Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./api')),
    router.use('/auth', require('./auth')),
    router.use('/authors', require('./author')),
    router.use('/books', require('./book')),
    router.use('/categories', require('./category')),
    router.use('/pages', require('./page')),
    // require('./page'),
    router.use('/t4t', require('./t4t'))
  )
}