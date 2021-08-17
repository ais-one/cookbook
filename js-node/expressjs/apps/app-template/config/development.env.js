const selfsigned = require('selfsigned')
const samlPems = selfsigned.generate(null, { days: 30, algorithm: 'sha256' })

module.exports = {
  KNEXFILE: {
    client: 'sqlite3',
    connection: { filename: 'dev.sqlite3' }, // relative to directory that package.json was run
    useNullAsDefault: true  
  },

  MONGO_DB: 'testdb-' + process.env.NODE_ENV,
  MONGO_URL: 'mongodb://127.0.0.1:27017/testdb-' + process.env.NODE_ENV,
  
  JWT_REFRESH_STORE: 'keyv',
  USE_GRAPHQL: true,
  CORS_ORIGINS: [
    'http://127.0.0.1:8080','http://127.0.0.1:3000','http://127.0.0.1:8081', // port 8081 is from SAML
    'https://127.0.0.1:8080','https://127.0.0.1:3000','https://127.0.0.1:8081', // port 5500 ? unknown
    'https://192-168-18-8.nip.io:3000', 'http://localhost:3000'// fido2 testing
  ].join(','),

  WEB_STATIC: [ // serve website from folder, blank if do not serve from express. Must be '' if there is PROXY_WWW_ORIGIN
    // options does not seem to work
    // { folder: 'openapi', url: '/ftp2', options: {'icons': true}, list: true },
    { folder: 'apps/app-template/openapi', url: '/openapi' },
    { folder: '../../@es-labs/esm', url: '/esm' },
    { folder: '../../js-web/vue-nobundler', url: '/native', options: { extensions: ['html'], index: false } },
    { folder: '../../js-web/vue-vite/dist', url: '/vite', options: { extensions: ['html'], index: false } },
    { folder: '../../js-web/lucia', url: '/lucia', options: { extensions: ['html'], index: false } },
    { folder: '../../js-web/solid', url: '/solid', options: { extensions: ['html'], index: false } },
    { folder: 'public/demo-express', url: '/' }, // last as path is /
  ],

  SAML_DECRYPTION_CERT: samlPems.cert, // { private, cert }
  SAML_OPTIONS: {
    // NOTE: need to setup keycloak for SAML see readme in docker-devenv folder
    issuer: 'test-saml-client',
    callbackUrl: 'http://127.0.0.1:3000/api/saml/callback',
    entryPoint: 'http://127.0.0.1:8081/auth/realms/test/protocol/saml',
    // PEM in single string, this property is to ensure Response not from spoofed IDP
    // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'),
    cert: 'MIIClzCCAX8CBgF6A0sAhDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR0ZXN0MB4XDTIxMDYxMzAyNTMwNFoXDTMxMDYxMzAyNTQ0NFowDzENMAsGA1UEAwwEdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK97NlCcNOhtH0a0wz5boYKb7TaxogxnlyysOWUre1uI8SC6EBV3G5DHMdg4aWXwuXwy61+JJu70xNzJj155MJ+atGS7eLrxxGl0DNoLu/LU7Vhht+j09MZt5J60DnS76H3pkvzAtRfd1P/d5JEFzWYkI4drBJccYX/nrrx2KZBkXOjwjVcEhsyK5ykA0LX+M+yFDy2w8qEWhxHuSL6enzw8IZ7qdtsF8SHqw7cdCgCJU6+0dxaRAAqmzMkO7BDEkwCJl0M8VaOPGo/SnZIAMYHLIUg1x0h/ecST4NPdqAwgDGtWAcD+Gp7Lr7xfBbKKqnLfg2PJdjs7Z0+NFOeVTvcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAeJ2r2yoaQAo6v8MC6iAobOeJoBoezQg/OSQqeA9lygMWmGHpDIjSV7m3PCXwf5H9/NpHgBLt8y5PcjEs99uPfPeUBV/qitTFMuznMyr35e60iaHSdhZVjyCmrKgnIuGa07lng2wFabtpijqzbQJ99kYsWxbBDgbdVnt3jxohG1KKaXkGMyy7suwPgwrbwXfDrpyyj33NT/Dk/2W4Fjrjg8rIkuQypwB0SQLG1cZL9Z2AgW39JeVnP/sOH1gNpCCQwbpgE9hEed80jsYWlvucnFm2aHBtGV+/7/7N3qRRpIvzrNVJoznqDDWU41RxS0NphAwX2ZqprWvN+SCEEhPGGQ==',

    privateKey: samlPems.private, // for signature
    privateCert: samlPems.cert,
    decryptionPvk: samlPems.private, // optional private key that will be used to attempt to decrypt any encrypted assertions that are received
    signatureAlgorithm: 'sha256',

    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows', //  use AD
    acceptedClockSkewMs: -1, // DGAF on time diff between IDP and SP
    identifierFormat: null,
    // this is configured under the Advanced tab in AD FS relying party
    // RACComparison: 'minimum', // default to exact RequestedAuthnContext Comparison Type: minimum, exact (sometimes cause problems)
    disableRequestedAuthnContext: true,
    validateInResponseTo: false,

    // wantAssertionsSigned: true,
  },
  SAML_JWT_MAP: {
    id: 'nameID',
    groups: 'Role'
  },

  // NOTE: need to setup keycloak for OIDC see readme in docker-devenv folder
  OIDC_OPTIONS: {
    URL: 'http://127.0.0.1:8081/auth/realms/test/protocol/openid-connect',
    CLIENT_ID: 'test-oidc-client',
    CLIENT_SECRET: '',
    CALLBACK: 'http://127.0.0.1:8080/callback'
  },

  GCP_DEFAULT_BUCKET: 'mybot-live.appspot.com',

  TEST_ENV: 'aaa',
  ENABLE_LOGGER: false,
  TTT: {
    aaa: 222,
    cccxx: 'cdcd',
    zzz: () => console.log('DO NOT USE FUNCTIONS!!!!')
  }

  // NOTE! in secret
  // KNEXFILE: null,
  // GCP_SERVICE_KEY: null,
  // OAUTH_OPTIONS: null,
  // FCM_SERVER_KEY: '', // Generated from firebase web dashboard
}
