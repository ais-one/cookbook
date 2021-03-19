'use strict'

const otplib = require('otplib')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const uuid = require('uuid/v4')
// const qrcode = require('qrcode')
const { USE_OTP, OTP_EXPIRY, COOKIE_HTTPONLY, COOKIE_SAMESITE, COOKIE_SECURE, COOKIE_MAXAGE, CORS_OPTIONS, AUTH_USER_STORE, AUTH_USER_STORE_NAME } = global.CONFIG
const { AUTH_USER_FIELD_LOGIN, AUTH_USER_FIELD_PASSWORD, AUTH_USER_FIELD_GAKEY, AUTH_USER_FIELD_ID_FOR_JWT, AUTH_USER_FIELDS_JWT_PAYLOAD = ''} = global.CONFIG
const { JWT_ALG, JWT_SECRET, JWT_EXPIRY, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE ='keyv', JWT_CERTS } = global.CONFIG

let mongo, ObjectID
if (AUTH_USER_STORE === 'mongo') {
  mongo = require('../services/db/mongodb').get()
  ObjectID = mongo.ObjectID
}

let Model, knex
if (AUTH_USER_STORE === 'objection') {
  Model = require('../services/db/objection').get()
  knex = Model ? Model.knex() : null  
}

// TBD getToken - check for revoked token? such token should not be available in Key-Value storage already
const { setToken, getToken, revokeToken } = require('./' + JWT_REFRESH_STORE)
const httpOnlyCookie = `HttpOnly;Path=/;SameSite=${COOKIE_SAMESITE};` + (COOKIE_SECURE ? 'Secure;':'') + (COOKIE_MAXAGE ? 'MaxAge='+COOKIE_MAXAGE+';':'')

// algorithm
// expiresIn
// issuer  = 'Mysoft corp' 
// subject  = 'some@user.com'
// audience  = 'http://mysoftcorp.in'
// ip

// We implement stateful refresh_token not stateless ATM

const findUser = async (where) => {
  if (AUTH_USER_STORE === 'mongo') {
    if (where.id) where = { _id: new ObjectID(where.id) }
    return await mongo.db.collection(AUTH_USER_STORE_NAME).findOne(where)
  } else if (AUTH_USER_STORE === 'objection') {
    return await knex(AUTH_USER_STORE_NAME).where(where).first()
  }
  return null
}

const updateUser = async (where, payload) => {
  if (AUTH_USER_STORE === 'mongo') {     
    if (where.id) where = { _id: new ObjectID(where.id) }
    return await mongo.db.collection(AUTH_USER_STORE_NAME).updateOne(where, { $set: payload })
  } else if (AUTH_USER_STORE === 'objection') {
    return await knex(AUTH_USER_STORE_NAME).where(where).first().update(payload)
  }
  return null
}

// mode: sign, verify
// type: access, refresh
const getSecret = (mode, type) => {
  if (JWT_ALG.substring(0,2) === 'RS') {
    if (mode === 'sign') {
      return type === 'refresh' ? JWT_CERTS.key : JWT_CERTS.key
    } else {
      return type === 'refresh' ? JWT_CERTS.cert : JWT_CERTS.cert
    }
  } else {
    return type === 'refresh' ? JWT_SECRET : JWT_SECRET
  }
}

const createToken = async (payload) => { // Create a token from a payload
  let access_token
  let refresh_token
  const options = { }
  try {
    options.algorithm = JWT_ALG

    options.expiresIn = JWT_EXPIRY
    access_token = jwt.sign(payload, getSecret('sign', 'access'), options)

    options.expiresIn = JWT_REFRESH_EXPIRY
    refresh_token = jwt.sign({ id: payload.id }, getSecret('sign', 'refresh'), options)

    await setToken(payload.id, refresh_token) // store in DB or Cache
  } catch (e) {
  }
  return {
    token,
    refresh_token
  }
}

const setTokensToHeader = (res, access_token, refresh_token) => {
  if (COOKIE_HTTPONLY) {
    res.setHeader('Set-Cookie', [
      `access_token=${access_token};`+ httpOnlyCookie,
      `refresh_token=${refresh_token};`+ httpOnlyCookie
    ])
  } else {
    res.setHeader('access_token', `${access_token}`)
    res.setHeader('refresh_token', `${refresh_token}`)
  }
}

const authUser = async (req, res, next) => {
  // console.log('auth express', req.baseUrl, req.path, req.cookies, req.signedCookies)
  let token
  try {
    // else token = req.headers.authorization.split(' ')[1]
    if (req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      let result = null
      try {
        result = jwt.verify(token, getSecret('verify', 'access'), { algorithm: [JWT_ALG] }) // and options
        if (!result.verified && (req.baseUrl + req.path !== '/api/auth/otp')) {
          return res.status(401).json({ message: 'Token Verification Error' })
        }
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          // console.log('req.path', req.baseUrl + req.path)
          if (req.baseUrl + req.path === '/api/auth/refresh' || req.baseUrl + req.path === '/api/auth/logout') {
            try {
              // check refresh token & user - always stateful
              if (req.cookies.refresh_token) {
                token = req.cookies.refresh_token
              } else if (req.headers.authorization) {
                if (req.headers.authorization.split(' ')[0] === 'Bearer') token = req.headers.authorization.split(' ')[1]
              }
          
              refreshDecoded = jwt.verify(token, getSecret('verify', 'refresh'), { algorithm: [JWT_ALG] }) // can throw token expired error
              // result = jwt.decode(token)
              const { id } = refreshDecoded
              let refreshToken = await getToken(id)
              if (refreshToken) {
                if (parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY) { // not too expired... exp is in seconds, iat is not used
                  if (String(refreshToken) === String(req.body.refresh_token) || String(refreshToken) === String(req.headers.refresh_token)) { // ok... generate new access token & refresh token?
                    if (req.baseUrl + req.path === '/api/auth/logout') {
                      req.decoded = result
                      return next()
                    } else {
                      const tokens = await createToken({ id, verified: true, ...payload }) // 5 minute expire for login
                      setTokensToHeader(res, tokens.access_token, tokens.refresh_token)
                      return res.status(200).json(tokens)  
                    }
                  }
                } else { // refresh_token expired
                  return res.status(401).json({ message: 'Refresh Token Error: Expired Or Invalid' })
                }
              } else {
                return res.status(401).json({ message: 'Refresh Token Error: Invalid Or Expired' })
              }
            } catch (err) { // use err instead of e (fix no-catch-shahow issue)
              // console.log('refreshing auth err', err.toString())
              return res.status(401).json({ message: 'Refresh Token Error: Unknown' })
            }
            return res.status(401).json({ message: 'Refresh Token Error: Uncaught' })
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
  return res.status(401).json({error: 'Error in token' })
}

const logout = async (req, res) => {
  try {
    await revokeToken(req.decoded.id) // clear
    if (COOKIE_HTTPONLY) res.clearCookie('token')
    return res.status(200).json({ message: 'Logged Out' })  
  } catch (e) {
    console.log(e.toString())
  }
  return res.status(500).json()  
}

const refresh = async (req, res) => {
  // refresh logic all done in authUser
  return res.status(401).json({ message: 'Error token revoked' })
}

const addPayloadFromUserData = (user) => { // obtain additional information from the payload...
  const keys = AUTH_USER_FIELDS_JWT_PAYLOAD.split(',')
  const payloadItems = {}
  if (keys && keys.length) {
    for (const key of keys) {
      if (key && user[key] !== undefined) payloadItems[key] = user[key]
    }
  }
  return payloadItems
}

const login = async (req, res) => {
  try {
    const user = await findUser({
      [AUTH_USER_FIELD_LOGIN]: req.body[AUTH_USER_FIELD_LOGIN]
    })
    const password = req.body[AUTH_USER_FIELD_PASSWORD]

    if (!user) return res.status(401).json({ message: 'Incorrect credentials...' })
    if (!bcrypt.compareSync(password, user[AUTH_USER_FIELD_PASSWORD])) return res.status(401).json({ message: 'Incorrect credentials' })
    if (user.revoked) return res.status(401).json({ message: 'Authorization Revoked' })
    let verified = true
    const id = user[AUTH_USER_FIELD_ID_FOR_JWT] || ''
    const additionalPayload = addPayloadFromUserData(user)

    if (!id) return res.status(401).json({ message: 'Authorization Format Error' })
    if (USE_OTP) {
      verified = false
      // if (USE_OTP === 'SMS') {
      //   // Generate PIN
      //   const pin = (Math.floor(Math.random() * (999999 - 0 + 1)) + 0).toString().padStart(6, "0")
      //   const ts = new Date() // utc?
      //   // update pin where ts > ?
      //   // set user SMS & send it
      // }
    }
    const tokens = await createToken({ id, verified, ...additionalPayload }, { expiresIn: USE_OTP ? OTP_EXPIRY : JWT_EXPIRY }) // 5 minute expire for login
    setTokensToHeader(res, tokens.access_token, tokens.refresh_token)
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('login err', e.toString())
  }
  return res.status(500).json()  
}

const otp = async (req, res) => { // need to be authentication, body { pin: '123456' }
  try {
    const { id } = req.decoded
    const user = await findUser({ id })
    if (user) {
      const { pin } = req.body
      const gaKey = user[AUTH_USER_FIELD_GAKEY]
      const isValid = USE_OTP !== 'TEST' ? otplib.authenticator.check(pin, gaKey) : String(pin) === '111111'
      if (isValid) {
        await revokeToken(id)
        const additionalPayload = addPayloadFromUserData(user)
        const tokens = await createToken({ id, verified: true, ...additionalPayload })
        setTokensToHeader(res, tokens.access_token, tokens.refresh_token)
        return res.status(200).json(tokens)
      } else {
        return res.status(401).json({ message: 'Error token wrong pin' })
      }
    }
  } catch (e) { console.log('otp err', e.toString()) }
  return res.status(401).json({ message: 'Error token revoked' })
}

module.exports = { findUser, updateUser, createToken, setTokensToHeader, revokeToken, authUser, logout, refresh, login, otp, bcrypt, otplib } // getToken, setToken,

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

// const crypto = require('crypto-js')
// let ct = crypto.enc.Base64.parse('your-cipher-text')
// let iv = crypto.enc.Base64.parse('your-iv')
// let key = crypto.enc.Base64.parse('your-key')
// const decrypt = crypto.algo.AES.createDecryptor(key, { iv })
// const proc = decrypt.process(ct)
// const final = decrypt.finalize()
// const plain = proc.toString(crypto.enc.Utf8) + final.toString(crypto.enc.Utf8)
// console.log(plain)


// do refresh token check from backend?

/*

Signout across tabs

window.addEventListener('storage', this.syncLogout) 

//....


syncLogout (event) {
  if (event.key === 'logout') {
    console.log('logged out from storage!')
    Router.push('/login')
  }
}

async function logout () {
  inMemoryToken = null;
  const url = 'http://localhost:3010/auth/logout'
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  })
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
}

*/


/*
The user logs in with a login API call.
Server generates JWT Token and refresh_token
Server sets a HttpOnly cookie with refresh_token. jwt_token and jwt_token_expiry are returned back to the client as a JSON payload.
The jwt_token is stored in memory.
A countdown to a future silent refresh is started based on jwt_token_expiry
*/

// https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
