'use strict'

const categories = require('./categories')

module.exports = (app) => {
  app.use(`/api/app-custom`, categories )
}
