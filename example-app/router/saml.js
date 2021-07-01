'use strict'

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const { createToken } = require('@es-labs/node/auth')
const passport = require('@es-labs/node/express/passport').get()

const { AUTH_ERROR_URL } = global.CONFIG

module.exports = express.Router()
  .get('/test', (req,res) => res.send('ok'))
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
      // console.log(req.query.RelayState)
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  .post('/login/callback',
    // bodyParser.urlencoded({ extended: false }),
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    async (req, res) => {
      try {
        const relayState = req.body.RelayState.split(';') // 0 = frontend callback, 1 = allowed groups, 2 = expiry
        const TO = relayState[0]
        if (req.isAuthenticated()) {
          console.log('saml2', req.user)
          const user = {
            // [kristophjunge/test-saml-idp]
            // id: req.user.uid, // currently either id (knex) / _id (mongodb)
            // groups: req.user.eduPersonAffiliation,
            // [keycloak]
            id: req.user.nameID, // string
            groups: req.user.Role, // comma seperated string
          }
          const tokens = await createToken(user)
          res.redirect(TO + '#' + tokens.access_token + '-' + tokens.refresh_token + '-' + JSON.stringify(tokens.user_meta)) // use url fragment...
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

