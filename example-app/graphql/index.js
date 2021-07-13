'use strict'

module.exports = function (app, server) {
  if (APP_NAME) require(`../${APP_NAME}/graphql`)(app, server)
}
