'use strict'

const { SAML_OPTIONS } = global.CONFIG
const passport = require('passport')

// https://github.com/bergie/passport-saml/blob/master/docs/adfs/README.md
exports.init = (app) => {
  if (SAML_OPTIONS) {
    const SamlStrategy = require('passport-saml').Strategy

    app.use(passport.initialize())
    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((user, done) => { done(null, user) })
    passport.use('saml', new SamlStrategy(
      SAML_OPTIONS,
      (profile, done) => {
        // console.log('profile', profile)
        return done(null, { // map whatever claims/profile info you want here
          // upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
          // // e.g. if you added a Group claim
          // group: profile['http://schemas.xmlsoap.org/claims/Group']
          ...profile
        })
      }
    ))
  }
}

exports.get = () => passport