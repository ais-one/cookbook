// working SAML ADFS example
// https://github.com/bergie/passport-saml/blob/master/docs/adfs/README.md

const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
// const fs = require('fs')

// TBD app.use(passport.initialize())

passport.serializeUser(function(user, done) { done(null, user) })
passport.deserializeUser(function(user, done) { done(null, user) })

passport.use(new SamlStrategy(
  {
    // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'), // PEM in single string to ensure ADFS Server is not a fake one
    issuer: 'acme_tools_com',
    callbackUrl: 'https://acme_tools.com/adfs/postResponse',
    entryPoint: 'https://adfs.acme_tools.com/adfs/ls/',
    // privateCert: fs.readFileSync('/path/to/acme_tools_com.key', 'utf-8'), // not needed yet
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
    authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
    // not sure if this is necessary?
    acceptedClockSkewMs: -1,
    identifierFormat: null,
    // this is configured under the Advanced tab in AD FS relying party
    signatureAlgorithm: 'sha256',
    RACComparison: 'minimum', // default to exact RequestedAuthnContext Comparison Type: minimum, exact (sometimes cause problems)
    disableRequestedAuthnContext: true,
  },
  function(profile, done) {
    return done(null, { // map whatever claims/profile info you want here
      upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
      // e.g. if you added a Group claim
      group: profile['http://schemas.xmlsoap.org/claims/Group']
    })
  }
))

/*
app.get('/saml',
  function(req, res, next) {

    // return res.redirect('/' + token...) // for faking, bypass real callback

    req.query.RelayState = req.query.redirect_to + ';' + req.query.groups + ';' + req.query.expiry
    next()
  },
  passport.authenticate('saml') // , { failureRedirect: '/', failureFlash: true }),
)

app.post('/saml/callback',
  // bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    try {
      const relayState = req.body.RelayState.split(';')
      const TO = relayState[0]
      if (req.isAuthenticated()) {
        // For SPA
        // also settle/check the groups and expiry
        const token = CreateJWT()
        res.redirect(TO + '/#' + token);
      } else {
        res.redirect('/forbidden')
      }
    } catch (e) {
      res.status(500).json({ e: 'error' })
    }
  }
);

// '/logout'
// res.redirect( LOGOUT_URL )

*/

/*
Client Side

export default class Abc {
  constructor(config) {
    this._token = ''
    this._payload = null
  }
  val() { // try catch
    let token = window.location.hash.substring(1) // (new URL(window.location.href)).searchParams.get('token')
    if (!token) this.getFromLocalStorage()
    if (!token) this.login()
    else thi.setToken(token)
  }
  login () {
    const redirect = (window.location.protocol + // + window.location.hostname) + (window.location.port === 443 || window.location.port === 80) ? '' : window.location.port + '/callback-url'
    const goto = 'http://authserver' + `/auth?redirect_to=${goto}&groups=&expiry=`
    window.location.assign(goto)
  }

  logout - cleartoken - window.location.replace('https://adfc.test.com/adfs/ls/?wa=wsignout1.0&wreply='+ encodeURIComponent(LOGOUT_URL))
}

mounted
  import Abc from './asdasd.js'
  let abc = new Abc(conf)
  abc.val()
  if (abc._token) {
    this.payload = abc._payload
    this.token = abc._token  }

*/
module.exports = passport
