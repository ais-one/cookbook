'use strict'

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const passport = require('passport')
const { createToken } = require('@es-labs/node/auth')

const { AUTH_ERROR_URL, SAML_OPTIONS } = global.CONFIG

if (SAML_OPTIONS) {
  const SamlStrategy = require('passport-saml').Strategy
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

module.exports = express.Router()
  .get('/test', (req,res) => res.send('ok'))
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  .post('/callback',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    async (req, res) => {
      try {
        console.debug('saml2 user:', req.user)
        console.debug('saml2 relayState:', req.body.RelayState)
        const relayState = req.body.RelayState.split(';') // 0 = frontend callback, 1 = allowed groups, 2 = expiry
        const TO = relayState[0]
        if (req.isAuthenticated()) {
          const user = {
            // [kristophjunge/test-saml-idp]
            // id: req.user.uid, // currently either id (knex) / _id (mongodb)
            // groups: req.user.eduPersonAffiliation,
            // [keycloak]
            id: req.user.nameID, // string
            groups: req.user.Role, // comma seperated string
          }
          const tokens = await createToken(user)
          return res.redirect(TO + '#' + tokens.access_token + '-' + tokens.refresh_token + '-' + JSON.stringify(tokens.user_meta)) // use url fragment...
        } else {
          return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
        }
      } catch (e) {
        return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(500).json({ error: e.toString() })
      }
    }
  )

// '/logout'
// res.redirect( LOGOUT_URL )

