'use strict'

const axios = require('axios')
const express = require('express')

const { OIDC_OPTIONS } = global.CONFIG

const AUTH_URL = `${OIDC_OPTIONS.URL}/auth?client_id=${OIDC_OPTIONS.CLIENT_ID}&response_type=code`
const TOKEN_URL = `${OIDC_OPTIONS.URL}/token`

module.exports = express.Router()
  .get('/login', asyncWrapper(async (req, res) => {
    res.redirect(AUTH_URL)
  }))
  
  .get('/auth', asyncWrapper(async (req, res) => {
    const { code, session_state } = req.query
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    // const payload = `grant_type=authorization_code&code=${code}&redirect_uri=${APP_BASE_URL}&client_id=${CLIENT_ID}` // redirects back here again...
    const payload = new URLSearchParams()
    payload.append('grant_type', 'authorization_code')
    payload.append('code', code)
    payload.append('redirect_uri', OIDC_OPTIONS.CALLBACK)
    payload.append('client_id', OIDC_OPTIONS.CLIENT_ID)

    const rv = await axios.post(TOKEN_URL, payload, { headers })
    console.log('/api/oidc/auth', rv.data)
    const access_token = rv.data.access_token
    res.redirect(OIDC_OPTIONS.CALLBACK + '#' + access_token)
  }))
  