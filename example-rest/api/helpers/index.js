const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs')
const qrcode = require('qrcode')
const otplib = require('otplib')

const keyv = require('../middleware/keyv')

const User = require('../models/user')

// const {firestore} = require('../middleware/firebase')
const SALT_ROUNDS = 12
const USE_OTP = process.env.USE_OTP || '' // true in production
const SECRET_KEY = process.env.SECRET_KEY || '123456789'
const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY || '987654321'
const KEY_EXPIRY = process.env.KEY_EXPIRY || '1h'

// Create a token from a payload 
function createToken(payload, secretKey, expiresIn = KEY_EXPIRY) {
  return jwt.sign(payload, secretKey, {expiresIn})
}

// Verify the token 
function verifyToken(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey)
    return decoded
  } catch (e) {
    return null
  }
  // return jwt.verify(token, secretKey, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
async function isAuthenticated({ email, password }) {
  let user = null
  try {
    user = await User.query().where('email', '=', email)
    if (user && bcrypt.compareSync(password, user[0].password)) return user[0]
  } catch (e) { }
  return null
}

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated,
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
/*
  processError: (e) => {
    const messages = {
      '200': 'Ok',
      '201': 'Created',
      '400': 'Client Error',
      '403': 'Forbidden',
      '404': 'Not Found',
      '422': 'Invalid Input'
    }
    let status = '500'
    let data = 'Server Error'
    try {
      data = messages[e.message]
      status = e.message
    } catch(e) { }
    return { status, data }
  }
*/
}