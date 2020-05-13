const bcrypt = require('bcryptjs')
const axios = require('axios')
const otplib = require('otplib')
const { SALT_ROUNDS, HTTPONLY_TOKEN, USE_OTP, OTP_EXPIRY, JWT_EXPIRY, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('../config')
const { createToken, revokeToken } = require('../../common-app/auth')

const User = require('../models/User')

// const uuid = require('uuid/v4')
// const qrcode = require('qrcode')

// Check if the user github exists in database
async function isGithubAuthenticated(mode, { githubId }) {
  let user = null
  try {
    user = await User.query().where('githubId', '=', githubId)
    if (user) return user[0]
  } catch (e) {
    console.log(e.toSting())
  }
  return null
}

// Check if the user exists in database
async function isAuthenticated(mode, { email, password }) {
  let user = null
  try {
    if (mode === 'github') {
      user = await User.query().where('githubId', '=', githubId).first()
    } else if (mode === 'local') {
      const tempUser = await User.query().where('email', '=', email).first()
      // if (user && bcrypt.compareSync(password, user[0].password)) return user[0]  
      if (tempUser && bcrypt.compareSync(password, tempUser.password)) user = tempUser
    }
  } catch (e) {
    // console.log(e.toString())
  }
  return user
}

exports.signup = async (req, res) => {
  // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
  res.status(201).end()
}

exports.checkGithub = async (req, res) => {
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
    const user = await isGithubAuthenticated('github', { githubId }) // match github id with our user in our application
    if (!user) {
      const message = 'Unauthorized'
      return res.status(401).json({ message })
    }
    const { id, groups } = user
    const tokens = await createToken({ id, verified: true, groups }, {expiresIn: JWT_EXPIRY}) // 5 minute expire for login
    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('github auth err', e.toString())
  }
  return res.status(401).end()
}

exports.logout = async (req, res) => {
  try {
    await revokeToken(req.decoded.id) // clear
    return res.status(200).json({ message: 'Logged Out' })  
  } catch (e) {
    console.log(e.toSting())
  }
  return res.status(500).json()  
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await isAuthenticated('local', { email, password })
    if (!user) {
      const message = 'Incorrect email or password'
      return res.status(401).json({ message })
    }
    if (user.revoked) {
      return res.status(401).json({ message: 'Authorization Revoked' })
    }
    let verified = true
    const { id, groups } = user
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
    const tokens = await createToken({ id, verified, groups }, { expiresIn: USE_OTP ? OTP_EXPIRY : JWT_EXPIRY }) // 5 minute expire for login
    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('login err', e.toString())
  }
  return res.status(500).json()  
}

exports.refresh = async (req, res) => {
    // refresh logic all done in authUser
    return res.status(401).json({ message: 'Error token revoked' })
}

exports.otp = async (req, res) => {
  try {
    const { id, groups } = req.decoded
    const user = await User.query().where('id', '=', id)
    if (user) {
      const { pin } = req.body
      const { gaKey } = user[0]
      const isValid = USE_OTP !== 'TEST' ? otplib.authenticator.check(pin, gaKey) : pin === '111111'
      if (isValid) {
        await revokeToken(id)
        const tokens = await createToken({ id, verified: true, groups }, {expiresIn: JWT_EXPIRY})
        if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
        return res.status(200).json(tokens)
      } else {
        return res.status(401).json({ message: 'Error token wrong pin' })
      }
    }
  } catch (e) { console.log('otp err', e.toString()) }
  return res.status(401).json({ message: 'Error token revoked' })
}

exports.me = async (req, res) => {
  try {
    const { id } = req.decoded
    // you can also get more user information from here from a datastore
    return res.status(200).json({ user: id, ts: Date.now() })
  } catch (e) {
    console.log(e.toSting())
  }
  return res.status(401).json({ message: 'Error token revoked' })
}
