const { createToken, verifyToken } = require('../services')
const keyv = require('../services/keyv')

const { USE_OTP, KEY_EXPIRY, SECRET_KEY, OTP_SECRET_KEY } = require('../config')

const axios = require('axios')

module.exports = {
  authUser: async (req, res, next) => {
    // console.log('auth express', req.path)
    try {
      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Error in authorization format' })
      }
      const incomingToken = req.headers.authorization.split(' ')[1]
      const matchingToken = await keyv.get(incomingToken)
      if (matchingToken) {
        const key = (USE_OTP && req.path !== '/otp') ? OTP_SECRET_KEY : SECRET_KEY // select the key to use
        // console.log(key, OTP_SECRET_KEY, SECRET_KEY)
        const result = verifyToken(matchingToken, key)
        /* refresh token - also stateful, may not be useful
        const nowSeconds = parseInt(Date.now() / 1000)
        const tokenPeriodSeconds = result.exp - result.iat
        const elapsedSeconds = nowS - result.iat
        if (elapsedSeconds > 0.5 * tokenPeriodSeconds && elapsedSeconds <= tokenPeriodSeconds) {
          delete result.iat
          delete result.exp
          res.set('refresh-token', createToken(result))
        }
        */
        if (result) {
          req.decoded = result
          // Throttle createToken by checking exp & iat (claims must include iat and exp)
          const now = parseInt(Date.now() / 1000) // seconds
          const triggerTime = result.iat + parseInt((result.exp - result.iat) / 2)
          if (now > triggerTime) { // 2 minutes to expiry - this may cause problems...
            // please be careful here, if first time, token may not be set and you get error logging in ?
            // console.log('update token')
            delete result.exp // id, iat, remove exp
            await keyv.set(incomingToken, createToken(result, key, {expiresIn: KEY_EXPIRY}))
          }
          return next()
        }
      }
    } catch (err) {
      console.log('authUser', err.toString())
    }
    return res.status(401).json({ message: 'Error in token' })
  }
}