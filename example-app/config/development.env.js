module.exports = {
  JWT_REFRESH_STORE: 'keyv',
  USE_GRAPHQL: true,
  CORS_ORIGINS: 'http://127.0.0.1:8080,http://127.0.0.1:5500,http://127.0.0.1:3000,http://127.0.0.1:8081', // port 8081 is from SAML

  // in secret
  // KNEXFILE: null,
  // GCP_SERVICE_KEY: null,
  // GITHUB_CLIENT_ID: '',
  // GITHUB_CLIENT_SECRET: '',
  // FCM_SERVER_KEY: '',

  SAML_OPTIONS: {
    // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'), // PEM in single string to ensure ADFS Server is not a fake one
    issuer: 'saml-poc',
    callbackUrl: 'http://127.0.0.1:3000/api/saml/login/callback', // 'https://acme_tools.com/adfs/postResponse'
    entryPoint: 'http://127.0.0.1:8081/simplesaml/saml2/idp/SSOService.php', // 'https://adfs.acme_tools.com/adfs/ls/'
    // privateCert: fs.readFileSync('/path/to/acme_tools_com.key', 'utf-8'), // not needed yet
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
    acceptedClockSkewMs: -1, // DGAF on time diff between IDP and SP
    identifierFormat: null,
    // this is configured under the Advanced tab in AD FS relying party
    // signatureAlgorithm: 'sha256',
    // RACComparison: 'minimum', // default to exact RequestedAuthnContext Comparison Type: minimum, exact (sometimes cause problems)
    disableRequestedAuthnContext: true,
    validateInResponseTo: false
  },


  TEST_ENV: 'aaa',
  ENABLE_LOGGER: false,
  TTT: {
    aaa: 222,
    cccxx: 'cdcd',
    zzz: () => console.log('ffff') //  DO NOT USE FUNCTIONS!!!
  }
}
