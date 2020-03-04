module.exports = function (app) {
  const swaggerUi = require('swagger-ui-express')
  const swaggerJSDoc = require('swagger-jsdoc')

  const  { SWAGGER_DEFS } = require('../'+ require('../appname') + '/config')

  // LOWER METHOD IS BETTER - app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./docs/openapi.yaml'), { // for OpenAPI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({ swaggerDefinition: SWAGGER_DEFS, apis: ['./routes/*.js'] }), { // for OpenAPI
    swaggerOptions: { docExpansion: 'none' },
    explorer: true
  }))

  return this
}
