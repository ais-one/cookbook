'use strict'

const axios = require('axios')
const { SALT_ROUNDS, COOKIE_HTTPONLY, COOKIE_SECURE, COOKIE_SAMESITE, COOKIE_MAXAGE, CORS_OPTIONS, JWT_EXPIRY } = global.CONFIG
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK } = global.CONFIG
const { findUser, createToken, setTokensToHeader, revokeToken, logout, refresh, login, otp } = require('@es-labs/node/auth')

const signup = async (req, res) => {
  // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
  res.status(201).end()
}

const httpOnlyCookie = `HttpOnly;Path=/;SameSite=${COOKIE_SAMESITE};` + (COOKIE_SECURE ? 'Secure;':'') + (COOKIE_MAXAGE ? 'MaxAge='+COOKIE_MAXAGE+';':'')

const checkGithub = async (req, res) => {
  try {
    const { code, state } = req.query
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code, state
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
    const tokens = await createToken({ id, groups }) // 5 minute expire for login
    setTokensToHeader(res, tokens)
    return res.redirect(GITHUB_CALLBACK + '#' + tokens.access_token + '-' + tokens.refresh_token + '-' + JSON.stringify(tokens.user_meta)) // use url fragment...
  } catch (e) {
    console.log('github auth err', e.toString())
  }
  return res.status(401).end()
}

const me = async (req, res) => {
  try {
    const { id } = req.decoded
    // you can also get more user information from here from a datastore
    return res.status(200).json({ user: id, ts: Date.now() })
  } catch (e) {
    console.log(e.toString())
  }
  return res.status(401).json({ message: 'Error token revoked' })
}

module.exports = {
  logout, refresh, login, otp, signup, me, checkGithub, httpOnlyCookie
}