const express = require('express')
const authRoutes = express.Router()
const otplib = require('otplib')

const { createToken, verifyToken, isAuthenticated } = require('../helpers')

const User = require('../models/user')
const keyv = require('../helpers/keyv')

const USE_OTP = process.env.USE_OTP || ''
const KEY_EXPIRY = process.env.KEY_EXPIRY || '15m'
const SECRET_KEY = process.env.SECRET_KEY || '123456789'
const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY || '987654321'

authRoutes
  .post('/signup', async (req,res) => {
    // const {email, password} = req.body
    // password = bcrypt.hashSync(password, SALT_ROUNDS)
    // const rv = await createUser(email, password)
    res.status(201).end()
  })
  .post('/login', async (req,res) => {
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
    res.status(200).json({ token })
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
    } catch (e) { }
    return res.status(401).json({ message: 'Error token revoked' })
  })

module.exports = authRoutes
