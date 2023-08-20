'use strict'

// auth0 customer identity cloud...? 

// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server

const express = require('express')
const { createToken, setTokensToHeader } = require('@es-labs/node/auth')

const { SAML_OPTIONS, SAML_JWT_MAP, SAML_CERTIFICATE, SAML_PRIVATE_KEY } = process.env

const samlJwtMap = JSON.parse(SAML_JWT_MAP || null)

const { AUTH_ERROR_URL } = process.env
const samlOptions = JSON.parse(SAML_OPTIONS || null)
if (samlOptions) {
  if (SAML_CERTIFICATE) samlOptions.privateCert = SAML_CERTIFICATE
  if (SAML_PRIVATE_KEY) {
    samlOptions.privateKey = SAML_PRIVATE_KEY
    samlOptions.decryptionPvk = SAML_PRIVATE_KEY
  }
  samlOptions.cert = 'MIIClTCCAX0CBgGKEEL5YTANBgkqhkiG9w0BAQsFADAOMQwwCgYDVQQDDANkZXYwHhcNMjMwODIwMDAwMzU5WhcNMzMwODIwMDAwNTM5WjAOMQwwCgYDVQQDDANkZXYwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCMznFveBcEc3SpeNOWYU33ZDwo+XjLkEJUcFIskuhTui5r8XAWjWnaR0wDKqGY/UjU7s8U7zc5lL+kn63EXbpdJkdwIPX6vlgJlz7aJ2H6GGpjC4KoHjNS3qP+8MQnZ2Y04oUGE6khKaYiDTrTT1qumtDcsKpcjFcKvlaINWWhsiivsj/icHih/Zw2U+wlktsjpCXxUMLIYno8z+R170tLLvH5UQHwwBSxiU7gaVnR9+fW1DbSdEMUTm16BJ9zi+vNmbSylvuvATVqEIVMoXsjAHCBZqGKQRu8IKYkEZ0phoVzOydl9tkQWxpbVHwfjzW2ZU+bko76Tbfv22VDYSkHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAGrBlnh1z/8WAOWhDFt7ZvUbTLdb/aWAEwaF8V21berxQKi/kHZmwVS8v1QjdUOXf1y0YoYQCzv3XnJky1cKzT6ndcVnB/LV+kEloJyUsVfYfKIzcUCNkjZtDge1rFT2Y8oQgdp/IqKkZTlKiMBgTYadhZBYLcjmlp9LebKiHlDIEF1w29/xUWQXTmcyHXjvkMxsuCcfJO3ZtFKE+jaO1Ov30iwc85VEuxreJRlw5v6i5N9un/X3pxz86Z/WS+QX8ldIddBVIQ0tQyjz4g9l4QkUm4E4/dD9KjZAqrYEVADqxdNUg25eoiYXwWKNPziyGemEbUXJTnqURzYnzW3no5c='
  samlOptions.wantAuthnResponseSigned = false
  // samlOptions.racComparison = 'minimum'
  samlOptions.wantAssertionsSigned = false
  // samlOptions.passive = true
}

let saml

if (samlOptions) {
  const { SAML } = require('@node-saml/node-saml')
  saml = new SAML(samlOptions)
}

module.exports = express.Router()
  .get('/test', async (req,res) => {
    // console.log(saml)
    try {
      const authUrl = await saml?.getAuthorizeUrlAsync() // validatePostResponseAsync (calls..., processValidlySignedPostRequestAsync)
      // console.log(authUrl)

      const parsedResponse = await saml?.validatePostResponseAsync(bodyx)
      // console.log(parsedResponse)

      res.json({ message: 'testing node-saml ok', authUrl, parsedResponse })
    } catch (e) {
      console.log(e) // , SAML_OPTIONS.privateCert
      res.status(500).json({message: 'testing node-saml error', error: e.toString()})
    }
  })
  .get('/login',
    (req, res, next) => {
      // return res.redirect('/' + token...) // for faking, bypass real callback
      // console.debug(req.header('referer'))
      // req.query.RelayState
      next()
    },
    async (req, res) => {
      // getAuthorizeUrlAsync(RelayState: string, host: string | undefined, options: AuthOptions)
      const authUrl = await saml?.getAuthorizeUrlAsync(req.query.RelayState) // validatePostResponseAsync (calls..., processValidlySignedPostRequestAsync)
      res.redirect(authUrl);
    },
  )
  // .get('/fail', (req, res) => res.status(401).send('Login Fail')
  .post('/callback',
    async (req, res, next) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 1')
      try {
        const parsedResponse = await saml?.validatePostResponseAsync(req.body)
        console.log(parsedResponse)
        res.json({ message: 'testing node-saml ok', parsedResponse })
      } catch (e) {
        console.log('SAML callback error', e)
        res.json({ message: e.toString() })
      }
      // next()

      // TBD get user
    },
    async (req, res) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 2')
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
            id: req.user[samlJwtMap.id], // id: req.user.nameID, // string
            groups: req.user[samlJwtMap.groups], // groups: req.user.Role, // comma seperated string or array or object...
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

