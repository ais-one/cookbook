const express = require('express')
const authRoutes = express.Router()
const otplib = require('otplib')

const { authUser } = require('../middleware/auth')
const { createToken, verifyToken, isAuthenticated } = require('../services')

const User = require('../models/User')
const keyv = require('../services/keyv')

const { USE_OTP, KEY_EXPIRY, SECRET_KEY, OTP_SECRET_KEY } = require('../config')

authRoutes
.post('/signup', async (req,res) => {
  // const {email, password} = req.body
  // password = bcrypt.hashSync(password, SALT_ROUNDS)
  // const rv = await createUser(email, password)
  res.status(201).end()
})
.get('/logout', authUser, async (req,res) => {
  try {
    const incomingToken = req.headers.authorization.split(' ')[1]
    await keyv.delete(incomingToken)
    // clear the token
    return res.status(200).json({ message: 'Logged Out' })  
  } catch (e) { }
  return res.status(500).json()  
})
.post('/login', async (req,res) => {
    try {
      const { email, password } = req.body
      const user = await isAuthenticated({ email, password })
      if (!user) {
        const message = 'Incorrect email or password'
        return res.status(401).json({ message })
      }
      const { id, clientId } = user
      const token = createToken({ id, clientId }, SECRET_KEY, USE_OTP ? '5m' : KEY_EXPIRY) // 5 minute expire for login
      await keyv.set(token, token)
      if (process.env.USE_OTP === 'SMS') {
        // Generate PIN
        const pin = (Math.floor(Math.random() * (999999 - 0 + 1)) + 0).toString().padStart(6, "0")
        const ts = new Date() // utc?
        // update pin where ts > ?
        // set user SMS
        if (process.env.NODE_ENV === 'development') {
  
        }
        // TBD send SMS
      }
      return res.status(200).json({ token })  
    } catch (e) { }
    return res.status(500).json()  
  })
  .post('/otp', async (req,res) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Error in authorization format' })
    }
    try {
      const incomingToken = req.headers.authorization.split(' ')[1]
      const matchingToken = await keyv.get(incomingToken)
      if (!matchingToken) {
        return res.status(401).json({ message: 'Error token mismatch' })
      }
      let result = verifyToken(incomingToken, SECRET_KEY) // has iat & exp also
      if (result) {
        const { id } = result
        const user = await User.query().where('id', '=', id)
        if (user) {
          const { pin } = req.body
          const { gaKey, id, clientId } = user[0]
          // process.env.USE_OTP === 'GA' // 'SMS'
          const isValid = process.env.NODE_ENV !== 'development' ? otplib.authenticator.check(pin, gaKey) : pin === '111111'
          if (isValid) {
            const token = createToken({ id, clientId }, OTP_SECRET_KEY)
            await keyv.set(token, token)
            await keyv.delete(incomingToken)
            return res.status(200).json({ token })
          }
        }
      }
    } catch (e) { console.log(e) }
    return res.status(401).json({ message: 'Error token revoked' })
  })

module.exports = authRoutes
