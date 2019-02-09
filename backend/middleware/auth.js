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
        if (result) { // id, iat, remove exp
          if (result.exp) delete result.exp
          req.decoded = result
          // console.log(result)
          // try to throttle createToken by check exp
          // const now = Date.now() / 1000
          // if (decoded.exp - now < 120) { // 2 minutes to expiry - this may cause problems...
          // please be careful here, if first time, token may not be set and you get error logging in
          // console.log('update token')
          await keyv.set(incomingToken, createToken(result, key, {expiresIn: KEY_EXPIRY})) // do refresh token here...
          // }
          return next()
        }
      } else { // try Github
        const rvx = await axios.get(`https://api.github.com/user?access_token=${incomingToken}`)
        if (rvx.status === 200) {
          // await keyv.set(incomingToken, createToken(result, key, {expiresIn: KEY_EXPIRY})) // do refresh token here...
          // console.log('GH', rvx.status) // 200 is OK
          return next()
        }
      }
    } catch (err) {
      console.log('authUser', err)
    }
    return res.status(401).json({ message: 'Error in token' })
  }
}