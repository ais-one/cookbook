// working SAML ADFS example
// https://github.com/bergie/passport-saml/blob/master/docs/adfs/README.md

const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
// const fs = require('fs')

passport.serializeUser(function(user, done) { done(null, user) })
passport.deserializeUser(function(user, done) { done(null, user) })

passport.use(new SamlStrategy(
  {
    issuer: 'acme_tools_com',
    callbackUrl: 'https://acme_tools.com/adfs/postResponse',
    entryPoint: 'https://adfs.acme_tools.com/adfs/ls/',
    // not needed
    // privateCert: fs.readFileSync('/path/to/acme_tools_com.key', 'utf-8'),
    // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'),
    // auth context
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
    authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
    // not sure if this is necessary?
    acceptedClockSkewMs: -1,
    identifierFormat: null,
    // this is configured under the Advanced tab in AD FS relying party
    signatureAlgorithm: 'sha256',
    RACComparison: 'exact', // default to exact RequestedAuthnContext Comparison Type
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
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
)

app.post('/saml/callback',
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    // For SPA
    const token = CreateJWT()
    res.redirect('/token=' + token);
  }
);
*/

module.exports = passport
