const express = require('express')
const passport = require('passport')
const { createToken } = require('@es-labs/node/auth')

const { JWT_EXPIRY } = global.CONFIG

module.exports = express.Router()
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
      console.log(req.query.RelayState)
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
          // console.log('saml2', req.user)
          const user = {
            id: req.user.uid, // currently either id (knex) / _id (mongodb)
            groups: req.user.eduPersonAffiliation
          }
          const tokens = await createToken(user)
          res.redirect(TO + '#' + tokens.access_token + '-' + tokens.refresh_token + '-' + JSON.stringify(tokens.user_meta)) // use url fragment...
        } else {
          res.json({ status: 'NOT authenticated' })
          // res.redirect('/forbidden')
        }
      } catch (e) {
        res.status(500).json({ error: e.toString() })
      }
    }
  )

// '/logout'
// res.redirect( LOGOUT_URL )

