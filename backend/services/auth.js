// const uuid = require('uuid/v4')
// const qrcode = require('qrcode')
// const otplib = require('otplib')
// const axios = require('axios')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const keyv = require('./keyv')

const User = require('../models/User')

const { USE_HTTPS, HTTPONLY_TOKEN, USE_OTP, JWT_ALG, JWT_EXPIRY, JWT_SECRET, JWT_REFRESH_EXPIRY } = require('../config')

const { jwtCerts } = require('./certs')

// algorithm
// expiresIn
// issuer  = 'Mysoft corp' 
// subject  = 'some@user.com'
// audience  = 'http://mysoftcorp.in'
// ip

// Create a token from a payload
async function createToken(payload, options) {
  let token
  let refreshToken
  try {
    options.algorithm = JWT_ALG
    const secretKey = JWT_ALG.substring(0,2) === 'RS' ? jwtCerts.key : JWT_SECRET
    token = jwt.sign(payload, secretKey, options)
    refreshToken = Date.now()
    if (refreshToken) await keyv.set(payload.id, refreshToken) // TBD set in DB instead...
  } catch (e) {
    console.log('createToken', e.toString())
  }
  return { token, refresh_token: refreshToken }          
}

async function revokeToken(id) {
  await keyv.delete(id) // clear
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

async function isGithubAuthenticated(githubId) {
  let user = null
  try {
    user = await User.query().where('githubId', '=', githubId)
    if (user) return user[0]
  } catch (e) { }
  return null
}

const authUser = async (req, res, next) => {
  // console.log('auth express', req.baseUrl, req.path, req.cookies, req.signedCookies)
  let token
  try {
    // if (HTTPONLY_TOKEN) {
    //   token = req.cookies.token
    // } else {
    //   if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    //     return res.status(401).json({ message: 'Error in authorization format' })
    //   }
    //   token = req.headers.authorization.split(' ')[1]
    // }
    if (req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1]
      }
    }

    // console.log(req.path, req.cookies)
    if (token) { // matchingToken
      // USE_OTP && req.path !== '/otp'
      let result = null
      try {
        const secretKey = JWT_ALG.substring(0,2) === 'RS' ? jwtCerts.cert : JWT_SECRET
        result = jwt.verify(token, secretKey, { algorithm: [JWT_ALG] }) // and options
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          // console.log('req.path', req.baseUrl + req.path)
          if (req.baseUrl + req.path === '/api/auth/refresh') {
            try {
              // check refresh token & user - always stateful
              const { id, exp } = jwt.decode(token)
              const user = await User.query().where('id', '=', id)
              if (user && !user[0].revoked && req.body) {
                const refreshToken = true ? await keyv.get(id) // use Cache
                  : user[0].refreshToken // TBD use DB - maybe better to use DB since it is already being read
                // console.log('ggg', req.baseUrl, req.path, parseInt(Date.now() / 1000) - exp, JWT_REFRESH_EXPIRY, e.toString(), parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY, token)
                if (parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY) { // not too expired... exp is in seconds, iat is not used
                  if (refreshToken === req.body.refresh_token) { // ok... generate new access token & refresh token?
                    const tokens = await createToken({ id, verified: true },  { expiresIn: JWT_EXPIRY }) // 5 minute expire for login
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
  return res.status(401).json({ message: 'Error in token' })
}

module.exports = {
  authUser,
  createToken,
  revokeToken,
  isAuthenticated,
  isGithubAuthenticated
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

/*
const crypto = require('crypto')

function encryptText(algor, key, iv, text, encoding) {
  const cipher = crypto.createCipheriv(algor, key, iv)
  encoding = encoding || 'binary'
  let result = cipher.update(text, 'utf8', encoding)
  result += cipher.final(encoding)
  return result
}

function decryptText(algor, key, iv, text, encoding) {
  const decipher = crypto.createDecipheriv(algor, key, iv)
  encoding = encoding || 'binary'
  let result = decipher.update(text, encoding)
  result += decipher.final()
  return result
}

const data = 'This is a test'
const password = 'hello'
const algorithm = 'aes256'
const args = process.argv.slice(3)

data = args[0]
password = args[1]
algorithm = args[2]

console.log('Text: ' + data)
console.log('Password: ' + password)
console.log('Type: ' + algorithm)

const hash, key

if (algorithm.includes("256")) {
	hash = crypto.createHash('sha256')
  hash.update(password)
	key = new Buffer.alloc(32,hash.digest('hex'),'hex')
} else if (algorithm.includes("192")) {
	hash = crypto.createHash('sha192')
  hash.update(password);
	key = new Buffer.alloc(24,hash.digest('hex'),'hex')
} else if (algorithm.includes("128")) {
	hash = crypto.createHash('md5')
  hash.update(password)
  key = new Buffer.alloc(16,hash.digest('hex'),'hex')
}

const iv = new Buffer.alloc(16,crypto.pseudoRandomBytes(16))
console.log('Key: ' + key.toString('base64'))
console.log('Salt: ' + iv.toString('base64'))

const encText = encryptText(algorithm, key, iv, data, 'base64')
console.log('Encrypted: ' + encText)

const decText = decryptText(algorithm, key, iv, encText, 'base64')
console.log('Decrypted: ' + decText);
*/