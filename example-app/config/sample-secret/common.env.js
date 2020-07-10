// settings common to all 3 environments
// process.env.NODE_ENV
module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,
  SWAGGER_DEFS: {
    // Swagger / OpenAPI definitions
    info: {
      title: 'example-app',
      version: '1.0.0',
      description: 'A sample API',
    },
    host: '127.0.0.1:3000', // API host
    basePath: '/',
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Base', description: 'The Base API' },
    ],
    schemes: [ 'http', 'https' ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    consumes: ['application/json'],
    produces: ['application/json']
  },
  TTT: {
    aaa: 111,
    bbb: 'aaa',
    zzz: () => {
      console.log('aaa')
    }
  }
}
