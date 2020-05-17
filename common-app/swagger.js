module.exports = function (app) {
  const  { SWAGGER_DEFS, APPNAME } = require('./config')
  if (SWAGGER_DEFS) {
    const swaggerUi = require('swagger-ui-express')
    const swaggerJSDoc = require('swagger-jsdoc')
    // LOWER METHOD IS BETTER - app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./docs/openapi.yaml'), { // for OpenAPI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({ swaggerDefinition: SWAGGER_DEFS, apis: [`./${APPNAME}/router/**/*.js`] }), { // for OpenAPI
      swaggerOptions: { docExpansion: 'none' },
      explorer: true
    }))  
  }
  return this
}
