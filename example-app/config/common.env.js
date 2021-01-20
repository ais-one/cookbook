// settings common to all 3 environments
// process.env.NODE_ENV
module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,

  WEB_STATIC: [ // serve website from folder, blank if do not serve from express. Must be '' if there is PROXY_WWW_ORIGIN
    // options does not seem to work
    { folder: '../common-lib/esm', url: '/esm' },
    { folder: '../example-amp', url: '/amp', options: { extensions: ['html'], index: false } },
    { folder: '../example-native', url: '/native', options: { extensions: ['html'], index: false } },
    { folder: '../example-vite/dist', url: '/vite', options: { extensions: ['html'], index: false } },
    { folder: '../example-webpack/dist', url: '/webpack', options: { extensions: ['html'], index: false } },
    { folder: APP_PATH + '/lib/esm', url: '/js' },
    { folder: APP_PATH + '/public/demo-express', url: '/' }
  ],
  UPLOAD_STATIC: [
    { folder: APP_PATH + '/uploads', url: '/uploads' },
    { folder: '', url: '' }
  ],

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
