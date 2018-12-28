const { createToken, verifyToken } = require('../helpers')
const keyv = require('../helpers/keyv')

module.exports = {
  authUser: async (req, res, next) => {
    try {
      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Error in authorization format' })
      }
      const key = USE_OTP ? OTP_SECRET_KEY : SECRET_KEY
      const incomingToken = req.headers.authorization.split(' ')[1]
      const matchingToken = await keyv.get(incomingToken)
      if (matchingToken) {
        const result = verifyToken(matchingToken, key)
        if (result) {
          req.decoded = result
          const { id, clientId } = result
          // try to throttle createToken by check exp
          // const now = Date.now() / 1000
          // if (decoded.exp - now < 120) { // 2 minutes to expiry - this may cause problems...
          // please be careful here, if first time, token may not be set and you get error logging in
          // console.log('update token')
          await keyv.set(incomingToken, createToken({ id, clientId }, key)) // do refresh token here...
          // }
          return next()
        }
      }
    } catch (err) { }
    return res.status(401).json({ message: 'Error in token' })
  }
}