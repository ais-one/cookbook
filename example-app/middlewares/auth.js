const jwt = require('jsonwebtoken')
const keyv = require('../../common-app/keyv')
const User = require('../models/User') // TBD to change this...

const { HTTPONLY_TOKEN, JWT_ALG, JWT_EXPIRY, JWT_SECRET, JWT_REFRESH_EXPIRY } = require('../config')
const { jwtCerts } = require('../config')
const { createToken } = require('../../common-app/auth')

const KEYV_REFRESH_TOKEN = true

const authUser = async (req, res, next) => {
  // console.log('auth express', req.baseUrl, req.path, req.cookies, req.signedCookies)
  let token
  try {
    // if (HTTPONLY_TOKEN) token = req.cookies.token
    // else token = req.headers.authorization.split(' ')[1]
    // console.log(req.path, req.cookies)
    if (req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') token = req.headers.authorization.split(' ')[1]
    }
    if (token) { // matchingToken
      // USE_OTP && req.path !== '/otp'
      let result = null
      try {
        const secretKey = JWT_ALG.substring(0, 2) === 'RS' ? jwtCerts.cert : JWT_SECRET
        result = jwt.verify(token, secretKey, { algorithm: [JWT_ALG] }) // and options
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          // console.log('req.path', req.baseUrl + req.path)
          if (req.baseUrl + req.path === '/api/auth/refresh') {
            try {
              // check refresh token & user - always stateful
              const { id, groups, exp } = jwt.decode(token)
              let refreshToken

              if (KEYV_REFRESH_TOKEN) {
                refreshToken = await keyv.get(id)
              } else { // TBD use DB - maybe better to use DB since it is already being read
                const user = await User.query().where('id', '=', id) // TBD FIX THIS
                if (user && !user[0].revoked && req.body) {
                  refreshToken = user[0].refreshToken
                }
              }

              if (refreshToken) {
                // console.log('ggg', req.baseUrl, req.path, parseInt(Date.now() / 1000) - exp, JWT_REFRESH_EXPIRY, e.toString(), parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY, token)
                if (parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY) { // not too expired... exp is in seconds, iat is not used
                  if (refreshToken === req.body.refresh_token) { // ok... generate new access token & refresh token?
                    const tokens = await createToken({ id, verified: true, groups }, { expiresIn: JWT_EXPIRY }) // 5 minute expire for login
                    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
                    return res.status(200).json(tokens)
                  }
                }
              }
            } catch (e) {
              console.log('refreshing auth err', e.toString())
              return res.status(401).json({ message: 'Refresh Error 2' })
            }
            return res.status(401).json({ message: 'Refresh Error' })
          } else {
            return res.status(401).json({ message: 'Token Expired Error' })
          }
        } else {
          console.log('auth err', e.name)
        }
      }
      if (result) {
        req.decoded = result
        return next()
      }
    }
  } catch (e) {
    console.log('authUser', e.toString())
  }
  return res.status(401).json({ e: 'Error in token' })
}

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups === 'admin') {
    return next()
  }
  else {
    return res.status(401).json({ e: 'Not Allowed' })
  }
}

module.exports = {
  authUser,
  authIsAdmin
}