'use strict'

const axios = require('axios')
const express = require('express')
const { setTokensToHeader } = require('@es-labs/node/auth')

const { AUTH_ERROR_URL } = process.env
const OIDC_OPTIONS = JSON.parse(process.env.OIDC_OPTIONS || null) || {}

const AUTH_URL = OIDC_OPTIONS ? `${OIDC_OPTIONS.URL}/auth?` : ''
const TOKEN_URL = OIDC_OPTIONS ? `${OIDC_OPTIONS.URL}/token` : ''

// payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET) // if keycloak client access type is confidential

module.exports = express.Router()
  .get('/login', asyncWrapper(async (req, res) => {
    // &scope=openid%20offline_access // get id token and refresh token
    // &redirect_uri=ourApp%3A%2Fcallback
    // &state=237c671a-29d7-11eb-adc1-0242ac120002
    const payload = new URLSearchParams()
    payload.append('response_type', 'code')
    payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)
    if (OIDC_OPTIONS.CLIENT_SECRET) payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET)
    res.redirect(AUTH_URL + payload.toString())
  }))
  
  .get('/auth', async (req, res) => { // callback
    try {
      const { code, session_state } = req.query
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      // NOSONAR // const payload = `grant_type=authorization_code&code=${code}&redirect_uri=${APP_BASE_URL}&client_id=${CLIENT_ID}` // redirects back here again...
      const payload = new URLSearchParams()
      payload.append('grant_type', 'authorization_code')
      payload.append('code', code)
      payload.append('redirect_uri', OIDC_OPTIONS.CALLBACK)
      payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)
      // if (session_state)
      if (OIDC_OPTIONS.CLIENT_SECRET) payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET)
      // add offline_access to get refresh token

      const rv = await axios.post(TOKEN_URL, payload, { headers })
      const { access_token, refresh_token, ...user_meta } = rv.data
      return res.redirect(OIDC_OPTIONS.CALLBACK + '#' + access_token + ';' + refresh_token + ';' + JSON.stringify(user_meta))
    } catch (e) {
      return AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' })
    }
  })

  .get('/refresh', asyncWrapper(async (req, res) => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const payload = new URLSearchParams()
    payload.append('grant_type', 'refresh_token')
    payload.append('refresh_token', req.cookies?.refresh_token || req.header('refresh_token') || req.query?.refresh_token)
    payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)
    // add offline_access to get refresh token
    const rv = await axios.post(TOKEN_URL, payload, { headers })
    const { access_token, refresh_token } = rv.data
    const tokens = { access_token, refresh_token }
    setTokensToHeader(res, tokens)
    res.json(tokens)
  }))

