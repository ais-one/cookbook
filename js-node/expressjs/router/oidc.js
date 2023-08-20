'use strict'

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

    // payload.append('redirect_uri', 'http://127.0.0.1:3000/api/oidc/auth')
    // payload.append('state', 'c45566104a3c7676c1cb92c33b19ab9bd91180c6')

    res.redirect(AUTH_URL + payload.toString())
  }))
  
  .get('/auth', async (req, res) => { // callback
    try {
      const { code, session_state } = req.query
      let payload = `grant_type=authorization_code&code=${code}`
        + `&redirect_uri=${OIDC_OPTIONS.CALLBACK}&client_id=${OIDC_OPTIONS.CLIENT_ID}`
      if (OIDC_OPTIONS.CLIENT_SECRET) payload += `&client_secret=${OIDC_OPTIONS.CLIENT_SECRET}`
      // add offline_access to get refresh token

      const res0 = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload, // JSON.stringify(payload),
      })
      const data = await res0.json();
      console.log('OIDC_OPTIONS', OIDC_OPTIONS, headers, payload, data)
      const { access_token, refresh_token, ...user_meta } = data
      return res.redirect(OIDC_OPTIONS.CALLBACK + '#' + access_token + ';' + refresh_token + ';' + JSON.stringify(user_meta))
    } catch (e) {
      console.log(e)
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
    const res0 = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    })
    const data = await res0.json();
    const { access_token, refresh_token } = data
    const tokens = { access_token, refresh_token }
    setTokensToHeader(res, tokens)
    res.json(tokens)
  }))

