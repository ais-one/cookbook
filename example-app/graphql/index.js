'use strict'

module.exports = function (app, server) {
  const { CUSTOM_APP } = global.CONFIG
  if (CUSTOM_APP) require(`../${CUSTOM_APP}/graphql`)(app, server)
}
