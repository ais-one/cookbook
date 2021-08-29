'use strict'

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const passport = require('passport')
const { createToken, setTokensToHeader } = require('@es-labs/node/auth')

const { AUTH_ERROR_URL, SAML_OPTIONS, SAML_JWT_MAP, SAML_DECRYPTION_CERT } = global.CONFIG

let samlStrategy

const { SAML } = require('node-saml')
const samlx = new SAML(SAML_OPTIONS)
// NOSONAR const { SAML } = require('passport-saml/lib/node-saml')
// console.log(SAML_OPTIONS)
// cause problems in samlx
// privateCert: samlPems.cert,
// await saml.getLogoutResponseUrl({user, samlLogoutRequest}, {additionalParams});
// const {success} = await saml.validateRedirect(query, originalQuery);
// await saml.validatePostResponse(body);
// await saml.validatePostRequest(body);
// await saml.getAuthorizeForm();
// await saml.getAuthorizeUrl(options);
// await saml.getLogoutUrl(user, options);
// saml.generateServiceProviderMetadata(decryptionCert, signingCert);

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
  .get('/test', async (req,res) => {
    console.log(samlx.getAuthorizeUrl)
    try {
      const target = await samlx.getAuthorizeUrl()
      console.log(target)
    } catch (e) {
      console.log(e, SAML_OPTIONS.privateCert)
    }
    res.send('ok')
  })
  .get('/metadata', (req, res) => {
    res.type('application/xml')
    // res.status(200).send(samlStrategy.generateServiceProviderMetadata()) // if there is private key involved, then need to pass in cert
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(SAML_DECRYPTION_CERT, SAML_OPTIONS.privateCert)) // cert to match decryptionKey, cert to match privateKey
  })
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      // console.debug(req.header('referer'))
      // req.query.RelayState
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  // .get('/fail', (req, res) => res.status(401).send('Login Fail')
  .post('/callback',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    async (req, res) => {
      try {
        const TO = req.body.RelayState
        if (!TO) {
          // if no RelayState, then it is a test
          return res.status(200).json({
            authenticated: req.isAuthenticated(),
            user: req.user
          })
        }
        if (req.isAuthenticated()) {
          const user = {
            id: req.user[SAML_JWT_MAP.id], // id: req.user.nameID, // string
            groups: req.user[SAML_JWT_MAP.groups], // groups: req.user.Role, // comma seperated string or array or object...
          }
          const tokens = await createToken(user)
          setTokensToHeader(res, tokens)
          return res.redirect(TO + '#' + tokens.access_token + ';' + tokens.refresh_token + ';' + JSON.stringify(tokens.user_meta)) // use url fragment...
        } else {
          return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
        }
      } catch (e) {
        return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(500).json({ error: e.toString() })
      }
    }
  )

