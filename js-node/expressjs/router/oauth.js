'use strict'
const { AUTH_ERROR_URL } = process.env
const OAUTH_OPTIONS = JSON.parse(process.env.OAUTH_OPTIONS || null) || {}
const { userOps, createToken, setTokensToHeader } = require('@es-labs/node/auth')

const express = require('express')

// set callback URL on github to <schema://host:port>/api/oauth/callback
// initiated from browser - window.location.replace('https://github.com/login/oauth/authorize?scope=user:email&client_id=XXXXXXXXXXXXXXXXXXXX')

const callbackOAuth = async (req, res) => {
  try {
    const { code, state } = req.query
    const res0 = await fetch(OAUTH_OPTIONS.URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: OAUTH_OPTIONS.CLIENT_ID, client_secret: OAUTH_OPTIONS.CLIENT_SECRET, code, state }),
    })
    const data0 = await res0.json();

    const res1 = await fetch(OAUTH_OPTIONS.USER_URL, {
      method: 'GET',
      headers: { Authorization: `token ${data0.access_token}`, },
    })
    const data1 = await res1.json();
    const githubId = data1[OAUTH_OPTIONS.USER_ID] // github id, email

    const user = await userOps.findUser({ [OAUTH_OPTIONS.FIND_ID]: githubId }) // match github id (or email?) with our user in our application
    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const { id, groups } = user
    const tokens = await createToken({ id, groups })
    setTokensToHeader(res, tokens)
    return res.redirect(OAUTH_OPTIONS.CALLBACK + '#' + tokens.access_token + ';' + tokens.refresh_token + ';' + JSON.stringify(tokens.user_meta)) // use url fragment...
  } catch (e) {
    console.error('github auth err', e.toString())
    return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
  }
}

module.exports = express.Router()
  .get('/callback', callbackOAuth)
