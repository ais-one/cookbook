'use strict'

// working SAML ADFS example
// https://github.com/bergie/passport-saml/blob/master/docs/adfs/README.md

const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
// const fs = require('fs')

const { SAML_ISSUER, SAML_ENTRYPOINT, SAML_CALLBACK_URL } = global.CONFIG

module.exports = function(app) {
  app.use(passport.initialize())

  passport.serializeUser((user, done) => { done(null, user) })
  passport.deserializeUser((user, done) => { done(null, user) })
  
  passport.use('saml', new SamlStrategy(
    {
      // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'), // PEM in single string to ensure ADFS Server is not a fake one
      issuer: SAML_ISSUER,
      callbackUrl: SAML_CALLBACK_URL, // 'https://acme_tools.com/adfs/postResponse',
      entryPoint: SAML_ENTRYPOINT, // 'https://adfs.acme_tools.com/adfs/ls/',
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
    (profile, done) => {
      console.log('profile', profile)
      return done(null, { // map whatever claims/profile info you want here
        // upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
        // // e.g. if you added a Group claim
        // group: profile['http://schemas.xmlsoap.org/claims/Group']
        ...profile
      })
    }
  ))
}