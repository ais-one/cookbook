// settings common to all 3 environments
// process.env.NODE_ENV
module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,

  // in secret
  // JWT_CERTS: null, // { key: '', cert: '' },
  // HTTPS_CERTS: null,
  // GCP_SERVICE_KEY: null, // {}
  // KNEXFILE: null, // {}

  SWAGGER_DEFS: {
    // Swagger / OpenAPI definitions
    openapi: '3.0.3',
    info: {
      title: 'example-app',
      version: '0.0.0',
      description: 'A sample API',
    },
    host: '127.0.0.1:3000', // API host
    basePath: '/',
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Base', description: 'The Base API' },
    ],
    components: {
      schemes: [ 'http', 'https' ],
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
