const express = require('express')
const passport = require('passport')

module.exports = express.Router()
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      // req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
      next()
    },
    passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
  )
  .post('/login/callback',
    // bodyParser.urlencoded({ extended: false }),
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
      try {
        // const relayState = req.body.RelayState.split(';')
        // const TO = relayState[0]
        // console.log(req)
        if (req.isAuthenticated()) {
          // For SPA
          // also settle/check the groups and expiry
          // const token = CreateJWT()
          // res.redirect(TO + '/#' + token)
          res.json({
            status: 'authenticated',
            body: req.user
          })
        } else {
          res.json({
            status: 'NOT authenticated',
            body: req.body            
          })
          // res.redirect('/forbidden')
        }
      } catch (e) {
        res.status(500).json({ error: 'EEE' + e.toString() })
      }
    }
  )

// '/logout'
// res.redirect( LOGOUT_URL )

