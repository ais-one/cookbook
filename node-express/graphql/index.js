'use strict'

module.exports = function (app, server) {
  if (APP_NAME) require(`../apps/${APP_NAME}/graphql`)(app, server)
}
