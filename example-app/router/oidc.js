'use strict'

const axios = require('axios')
const express = require('express')

const { OIDC_OPTIONS } = global.CONFIG

const AUTH_URL = `${OIDC_OPTIONS.URL}/auth?`
const TOKEN_URL = `${OIDC_OPTIONS.URL}/token`

const { authUser } = require('../middlewares/auth')

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
  
  .get('/auth', asyncWrapper(async (req, res) => { // callback
    const { code, session_state } = req.query
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    // const payload = `grant_type=authorization_code&code=${code}&redirect_uri=${APP_BASE_URL}&client_id=${CLIENT_ID}` // redirects back here again...
    const payload = new URLSearchParams()
    payload.append('grant_type', 'authorization_code')
    payload.append('code', code)
    payload.append('redirect_uri', OIDC_OPTIONS.CALLBACK)
    payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)
    if (OIDC_OPTIONS.CLIENT_SECRET) payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET)
    // add offline_access to get refresh token

    const rv = await axios.post(TOKEN_URL, payload, { headers })
    console.log('/api/oidc/auth', rv.data)
    const { access_token, refresh_token } = rv.data
    res.redirect(OIDC_OPTIONS.CALLBACK + '#' + access_token + ',' + refresh_token)
  }))

  .get('/refresh', asyncWrapper(async (req, res) => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const payload = new URLSearchParams()
    payload.append('grant_type', 'refresh_token')
    payload.append('refresh_token', req?.headers?.refresh_token || req?.cookies?.refresh_token || req?.query?.refresh_token)
    payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)
    // add offline_access to get refresh token

    const rv = await axios.post(TOKEN_URL, payload, { headers })
    console.log('/api/oidc/refresh', rv.data)
    const { access_token, refresh_token } = rv.data
    res.json({ access_token, refresh_token })
  }))

