// settings common to all 3 environments
// process.env.NODE_ENV
const selfsigned = require('selfsigned')

const pems = selfsigned.generate(
  // [
  //   { name: 'commonName', value: '127.0.0.1' },
  //   { name: 'countryName', value: 'SG' },
  //   { name: 'localityName', value: '' },
  //   { name: 'stateOrProvinceName', value: '' },
  //   { name: 'organizationName', value: 'ES-LABS' },
  //   { name: 'organizationalUnitName', value: '' },
  //   { name: 'emailAddress', value: '' }
  // ],
  null, // can use null
  {
    // keySize: 1024, // the size for the private key in bits (default: 1024)
    days: 30, // how long till expiry of the signed certificate (default: 365)
    algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
    // extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
    // pkcs7: false, // include PKCS#7 as part of the output (default: false)
    // clientCertificate: false, // generate client cert signed by the original key (default: false)
    // clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
  }
)
// console.log(JSON.stringify(pems))
// console.log(pems.private)
// {
//   private: '-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQCBFMXMYS/+RZz6+qzv+xeqXPdjw4YKZC4y3dPhSwgEwkecrCTX\r\nsR6boue+1MjIqPqWggXZnotIGldfEN0kn0Jbh2vMTrTx6YwqQ8tceBPoyuuqcYBO\r\nOONAcKOB3MLnZbyOgVtbyT3j68JE5V/lx6LhpIKAgY0m5WIuaKrW6mvLXQIDAQAB\r\nAoGAU6ODGxAqSecPdayyG/ml9vSwNAuAMgGB0eHcpZG5i2PbhRAh+0TAIXaoFQXJ\r\naAPeA2ISqlTJyRmQXYAO2uj61FzeyDzYCf0z3+yZEVz3cO7jB5Pl6iBvzbxWuuuA\r\ncbJtWLhWtW5/jioc8F0EAzZ+lkC/XuVJdwKHDmwt2qvJO+ECQQD+dvo1g3Sz9xGw\r\n21n+fDG5i4128+Qh+JPgh5AeLuXSofc1HMHaOXcC6Wu/Cloh7QAD934b7W0A7VoD\r\ndLd/JLyFAkEAgdwjryyvdhy69e516IrPB3b+m4rggtntBlZREMrk9tOzeIucVO3W\r\ntKI3FHm6JebN2gVcG+rZ+FaDPo+ifJkW+QJBAPojrMwEACmUevB2f9246gxx0UsY\r\nbq6yM3No71OsWEEY8/Bi53CEQqg7Gq5+F6H33qcHmBEN8LQTngN9rY+vZh0CQBg0\r\nqJImii5B/LeK03+dICoMDDmCEYdSh9P+ku3GZBd+Lp3xqBpMmxDgi9PNPN2DwCs7\r\nhIfPpwGbXqtyqp7/CkECQB4OdY+2FbCciI473eQkTu310RMf8jElU63iwnx4R/XN\r\n/mgqN589OfF4SS0U/MoRzYk9jF9IAJN1Mi/571T+nw4=\r\n-----END RSA PRIVATE KEY-----\r\n',
//   public: '-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBFMXMYS/+RZz6+qzv+xeqXPdj\r\nw4YKZC4y3dPhSwgEwkecrCTXsR6boue+1MjIqPqWggXZnotIGldfEN0kn0Jbh2vM\r\nTrTx6YwqQ8tceBPoyuuqcYBOOONAcKOB3MLnZbyOgVtbyT3j68JE5V/lx6LhpIKA\r\ngY0m5WIuaKrW6mvLXQIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
//   cert: '-----BEGIN CERTIFICATE-----\r\nMIICjTCCAfagAwIBAgIBATANBgkqhkiG9w0BAQUFADBpMRQwEgYDVQQDEwtleGFt\r\ncGxlLm9yZzELMAkGA1UEBhMCVVMxETAPBgNVBAgTCFZpcmdpbmlhMRMwEQYDVQQH\r\nEwpCbGFja3NidXJnMQ0wCwYDVQQKEwRUZXN0MQ0wCwYDVQQLEwRUZXN0MB4XDTEz\r\nMDgxMzA1NDAyN1oXDTE0MDgxMzA1NDAyN1owaTEUMBIGA1UEAxMLZXhhbXBsZS5v\r\ncmcxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhWaXJnaW5pYTETMBEGA1UEBxMKQmxh\r\nY2tzYnVyZzENMAsGA1UEChMEVGVzdDENMAsGA1UECxMEVGVzdDCBnzANBgkqhkiG\r\n9w0BAQEFAAOBjQAwgYkCgYEAgRTFzGEv/kWc+vqs7/sXqlz3Y8OGCmQuMt3T4UsI\r\nBMJHnKwk17Eem6LnvtTIyKj6loIF2Z6LSBpXXxDdJJ9CW4drzE608emMKkPLXHgT\r\n6MrrqnGATjjjQHCjgdzC52W8joFbW8k94+vCROVf5cei4aSCgIGNJuViLmiq1upr\r\ny10CAwEAAaNFMEMwDAYDVR0TBAUwAwEB/zALBgNVHQ8EBAMCAvQwJgYDVR0RBB8w\r\nHYYbaHR0cDovL2V4YW1wbGUub3JnL3dlYmlkI21lMA0GCSqGSIb3DQEBBQUAA4GB\r\nAC9hGQlDh8anNo1YDJdG2mYqOQ5uybJV++kixblGaOkoDROPsWepUpL6kMDUtbAM\r\n4uXTyFkvlUQSaQkhNgOY5w/BRIAkCIu6u4D4XcjlCdwFq6vcKMEuWTHMAlBWFla3\r\nXJZAPO10PHuDen7JeMOUf1Re7lRFtwfRGAvVYmrvYFKv\r\n-----END CERTIFICATE-----\r\n'
// }

const refreshPems = selfsigned.generate(null, { days: 30, algorithm: 'sha256' })


module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,

  WEB_STATIC: [ // serve website from folder, blank if do not serve from express. Must be '' if there is PROXY_WWW_ORIGIN
    // options does not seem to work
    { folder: '../@es-labs/esm', url: '/esm' },
    { folder: '../example-amp', url: '/amp', options: { extensions: ['html'], index: false } },
    { folder: '../example-native', url: '/native', options: { extensions: ['html'], index: false } },
    { folder: '../example-vite/dist', url: '/vite', options: { extensions: ['html'], index: false } },
    { folder: 'public/demo-express', url: '/' }
  ],

  // for file uploads
  UPLOAD_STATIC: {
    folder: APP_PATH + '/uploads',
    url: '/uploads',
    options: {
      fileFilter: (req, file, cb) => { // better to also filter at frontend
        // console.log('fileFilter', file)
        if ( ['text', 'image'].find(item => file.mimetype.includes(item)) ) return cb(null, true) // accept image or text
        return cb(null, false, new Error("Only text/plain are allowed"))
      },
      limits: {
        files: 1,
        fileSize: 10000 // size in bytes
      },
    }
  },
  UPLOAD_MEMORY: {
    limits: {
      files : 1,
      fileSize: 500000 // size in bytes
    },
    // fileFilter,
  },

  JWT_EXPIRY: 5, // 5 // 1800 // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
  JWT_REFRESH_EXPIRY: 10, // 10 // 3600 // do not allow refresh handling after defined seconds
  OTP_EXPIRY: 30, // 8 // 30 // defined seconds to allow user to submit OTP
  JWT_ALG: 'HS256', // HS256, RS256
  // JWT_CERTS: null, // { key: '', cert: '' }, // in secret if plaintext
  // JWT_REFRESH_CERTS: null, // { key: '', cert: '' }, // in secret if plaintext
  JWT_CERTS: { // can be here if autogenerated
    key: pems.private,
    cert: pems.cert
  },
  JWT_REFRESH_CERTS: {
    key: refreshPems.private,
    cert: refreshPems.cert
  },
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
      securitySchemes: { // need to fix this for access & refresh token
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
