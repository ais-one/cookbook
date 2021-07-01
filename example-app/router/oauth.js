'use strict'
const axios = require('axios')
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_CALLBACK } = global.CONFIG
const { AUTH_ERROR_URL } = global.CONFIG
const { findUser, createToken, setTokensToHeader, revokeToken } = require('@es-labs/node/auth')

const express = require('express')

// set callback URL on github to <schema://host:port>/api/oauth/callback-github
// initiated from browser - window.location.replace('https://github.com/login/oauth/authorize?scope=user:email&client_id=XXXXXXXXXXXXXXXXXXXX')

const callbackGithub = async (req, res) => {
  try {
    const { code, state } = req.query
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: OAUTH_CLIENT_ID, client_secret: OAUTH_CLIENT_SECRET, code, state
    }, {
      headers: {
        Accept: 'application/json'
      }
    })
    const rv = await axios.get('https://api.github.com/user', { headers: { 'Authorization': `token ${data.access_token}` } })
    const githubId = rv.data.id // github id, email
    const user = await findUser({ githubId }) // match github id (or email?) with our user in our application
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    const { id, groups } = user
    const tokens = await createToken({ id, groups })
    setTokensToHeader(res, tokens)
    return res.redirect(OAUTH_CALLBACK + '#' + tokens.access_token + '-' + tokens.refresh_token + '-' + JSON.stringify(tokens.user_meta)) // use url fragment...
  } catch (e) {
    console.log('github auth err', e.toString())
    return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
    // return res.status(401).end()
  }
}

module.exports = express.Router()
  .get('/callback-github', callbackGithub)
