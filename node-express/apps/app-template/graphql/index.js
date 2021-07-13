'use strict'

let graphql

module.exports = function (app, server) {
  if (!graphql) {
    const schema = require('./schema')
    graphql = require('../../common/graphql')(app, server, schema)
  }
  return graphql
}
