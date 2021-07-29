'use strict'

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const passport = require('passport')
const { createToken, setTokensToHeader } = require('@es-labs/node/auth')

const { AUTH_ERROR_URL, SAML_OPTIONS, SAML_JWT_MAP, SAML_DECRYPTION_CERT } = global.CONFIG

const selfsigned = require('selfsigned');
const samlPems = selfsigned.generate(null, { days: 30, algorithm: 'sha256' }) // TO Make this configurable

let samlStrategy

if (SAML_OPTIONS) {
  const SamlStrategy = require('passport-saml').Strategy
  samlStrategy = new SamlStrategy(
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
  )
  passport.use('saml', samlStrategy)
}

module.exports = express.Router()
  .get('/test', (req,res) => res.send('ok'))
  .get('/metadata', (req, res) => {
    res.type('application/xml')
    // res.status(200).send(samlStrategy.generateServiceProviderMetadata()) // if there is private key involved, then need to pass in cert
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(SAML_DECRYPTION_CERT, SAML_OPTIONS.privateCert)) // cert to match decryptionKey, cert to match privateKey
  })
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  // .get('/fail', (req, res) => res.status(401).send('Login Fail')
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

            id: res.user[SAML_JWT_MAP.id], // id: req.user.nameID, // string
            groups: res.user[SAML_JWT_MAP.groups], // groups: req.user.Role, // comma seperated string or array or object...
          }
          const tokens = await createToken(user)
          setTokensToHeader(res, tokens)
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

