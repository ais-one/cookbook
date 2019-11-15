const axios = require('axios')
const express = require('express')
const authRoutes = express.Router()
const otplib = require('otplib')

const { SALT_ROUNDS, USE_OTP, OTP_EXPIRY, JWT_EXPIRY, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, NODE_ENV } = require('../config')

const { createToken, isAuthenticated, isGithubAuthenticated, authUser } = require('../services/auth')

const User = require('../models/User')
const keyv = require('../services/keyv')

authRoutes
  .post('/signup', async (req,res) => {
    // const {email, password} = req.body
    // password = bcrypt.hashSync(password, SALT_ROUNDS)
    // const rv = await createUser(email, password)
    res.status(201).end()
  })
  .post('/check-github', async (req,res) => {
    try {
      const { code, state } = req.body
      const { data } = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        state
      }, {
        headers: {
          Accept: 'application/json'
        }
      })
      const rv = await axios.get('https://api.github.com/user?access_token=' + data.access_token)
      const githubId = rv.data.id // github id, email
      const user = await isGithubAuthenticated(githubId) // match github id with our user in our application
      if (!user) {
        const message = 'Unauthorized'
        return res.status(401).json({ message })
      }
      const { id } = user
      const token = createToken({ id }, {expiresIn: JWT_EXPIRY}) // 5 minute expire for login
      await keyv.set(token, token)
      return res.status(200).json({ token })
    } catch (e) {
      console.log(e)
    }
    return res.status(401).end()
  })
  .get('/logout', authUser, async (req,res) => {
    // console.log('logging out')
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
      let verified = true
      const { id } = user
      if (USE_OTP) {
        verified = false
        if (USE_OTP === 'SMS') {
          // Generate PIN
          const pin = (Math.floor(Math.random() * (999999 - 0 + 1)) + 0).toString().padStart(6, "0")
          const ts = new Date() // utc?
          // update pin where ts > ?
          // set user SMS & send it
        }
      }
      const token = createToken({ id, verified }, { expiresIn: USE_OTP ? OTP_EXPIRY : JWT_EXPIRY }) // 5 minute expire for login
      await keyv.set(token, true) 
      // TBD res.setHeader('Set-Cookie', [`access_token=${token}; HttpOnly`]);
      return res.status(200).json({ token })
    } catch (e) { }
    return res.status(500).json()  
  })
  .post('/refresh', authUser, async (req,res) => {
    // refresh logic all done in authUser
    return res.status(401).json({ message: 'Error token revoked' })
  })
  .post('/otp', authUser, async (req,res) => {
    try {
      let result = req.decoded
      if (result) {
        const { id } = result
        const user = await User.query().where('id', '=', id)
        if (user) {
          const { pin } = req.body
          const { gaKey, id } = user[0]
          // USE_OTP === 'GA' // 'SMS'
          const isValid = NODE_ENV !== 'development' ? otplib.authenticator.check(pin, gaKey) : pin === '111111'
          if (isValid) {
            const incomingToken = req.headers.authorization.split(' ')[1]
            await keyv.delete(incomingToken)
            const token = createToken({ id, verified: true }, {expiresIn: JWT_EXPIRY})
            await keyv.set(token, true) // maybe set true to refresh token instead
            return res.status(200).json({ token })
          }
        }
      }
    } catch (e) { console.log(e) }
    return res.status(401).json({ message: 'Error token revoked' })
  })
  .get('/me', authUser, async (req,res) => {
    try {
      const { id } = req.decoded
      // you can also get more user information from here from a datastore
      return res.status(200).json({ user: id })
    } catch (e) { }
    return res.status(401).json({ message: 'Error token revoked' })
  })

module.exports = authRoutes
