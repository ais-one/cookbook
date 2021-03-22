'use strict'

const otplib = require('otplib')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const uuid = require('uuid/v4')
// const qrcode = require('qrcode')
const { USE_OTP, OTP_EXPIRY, COOKIE_HTTPONLY, COOKIE_SAMESITE, COOKIE_SECURE, COOKIE_MAXAGE, CORS_OPTIONS, AUTH_USER_STORE, AUTH_USER_STORE_NAME } = global.CONFIG
const { AUTH_REFRESH_URL, AUTH_USER_FIELD_LOGIN, AUTH_USER_FIELD_PASSWORD, AUTH_USER_FIELD_GAKEY, AUTH_USER_FIELD_ID_FOR_JWT, AUTH_USER_FIELDS_JWT_PAYLOAD = ''} = global.CONFIG
const { JWT_ALG, JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRY, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE ='keyv', JWT_CERTS, JWT_REFRESH_CERTS } = global.CONFIG

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

const { setToken, getToken, revokeToken } = require('./' + JWT_REFRESH_STORE)

// SameSite=None; must use with Secure;
// may need to restart browser, TBD set Max-Age, ALTERNATE use res.cookie, Signed?
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
      return type === 'refresh' ? JWT_REFRESH_CERTS.key : JWT_CERTS.key
    } else {
      return type === 'refresh' ? JWT_REFRESH_CERTS.cert : JWT_CERTS.cert
    }
  }
  return type === 'refresh' ? JWT_REFRESH_SECRET : JWT_SECRET
}

// should use:
// sub - for user id (access_token & refresh_token)
// groups - for user groups (access_token only)
// all other user related information sent on initial login and stored using local storage
// do not catch exception here, let functions above handle
const createToken = async (user) => { // Create a tokens & data from user
  const user_meta = { }
  const options = { }

  const id = user[AUTH_USER_FIELD_ID_FOR_JWT]

  if (!id) throw Error('User ID Not Found')
  if (user.revoked) throw Error('User Revoked')

  const groups = user.groups

  const keys = AUTH_USER_FIELDS_JWT_PAYLOAD.split(',')
  if (keys && keys.length) {
    for (const key of keys) {
      if (key && user[key] !== undefined) user_meta[key] = user[key]
    }
  }

  options.algorithm = JWT_ALG

  options.expiresIn = JWT_EXPIRY
  const access_token = jwt.sign({ id, groups }, getSecret('sign', 'access'), options)

  options.expiresIn = JWT_REFRESH_EXPIRY
  const refresh_token = jwt.sign({ id }, getSecret('sign', 'refresh'), options) // store only ID in refresh token?

  await setToken(id, refresh_token) // store in DB or Cache
  return {
    access_token,
    refresh_token,
    user_meta
  }  
}

const setTokensToHeader = (res, {access_token, refresh_token}) => {
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
  let access_result = null
  let access_token = req?.cookies?.access_token || req?.headers?.access_token
  if (access_token) {
    try {
      access_result = jwt.verify(access_token, getSecret('verify', 'access'), { algorithm: [JWT_ALG] }) // and options
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        try {
          if (AUTH_REFRESH_URL && (req.baseUrl + req.path === AUTH_REFRESH_URL)) {
            const refresh_token = req?.cookies?.refresh_token || req?.headers?.refresh_token // check refresh token & user - always stateful          
            const refresh_result = jwt.verify(refresh_token, getSecret('verify', 'refresh'), { algorithm: [JWT_ALG] }) // throw if expired or invalid
            const { id } = refresh_result
            let refreshToken = await getToken(id)
            if (String(refreshToken) === String(refresh_token)) { // ok... generate new access token & refresh token?
              const user = await findUser({ id })
              const tokens = await createToken(user) // 5 minute expire for login
              setTokensToHeader(res, tokens)
              return res.status(200).json(tokens)
            } else {
              return res.status(401).json({ message: 'Refresh Token Error: Uncaught' })              
            }
          } else {
            return res.status(401).json({ message: 'Token Expired Error' })
          }
        } catch (err) { // use err instead of e (fix no-catch-shadow issue)
          console.log(err)
          return res.status(401).json({ message: 'Refresh Token Error' })
        }
      } else {
        console.log('auth err', e.name)
      }
    }
    if (access_result) {
      req.decoded = access_result
      return next()
    }
  }
  return res.status(401).json({error: 'Token Error' })
}

const logout = async (req, res) => {
  let id = null
  try {
    let refresh_token = req?.cookies?.refresh_token || req?.headers?.refresh_token // check refresh token & user - always stateful          
    const result = jwt.decode(refresh_token)
    id = result.id
    jwt.verify(refresh_token, getSecret('verify', 'refresh'), { algorithm: [JWT_ALG] }) // throw if expired or invalid
  } catch (e) {
    if (e.name !== 'TokenExpiredError') id = null
  }
  try {
    if (id) {
      await revokeToken(id) // clear
      if (COOKIE_HTTPONLY) {
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
      }  
      return res.status(200).json({ message: 'Logged Out' })  
    }
  } catch (e) { }
  return res.status(500).json()  
}

const refresh = async (req, res) => {
  // refresh logic all done in authUser
  return res.status(401).json({ message: 'Error token revoked' })
}

const login = async (req, res) => {
  try {
    const user = await findUser({
      [AUTH_USER_FIELD_LOGIN]: req.body[AUTH_USER_FIELD_LOGIN]
    })
    const password = req.body[AUTH_USER_FIELD_PASSWORD]
    if (!user) return res.status(401).json({ message: 'Incorrect credentials...' })
    if (!bcrypt.compareSync(password, user[AUTH_USER_FIELD_PASSWORD])) return res.status(401).json({ message: 'Incorrect credentials' })
    if (user.revoked) return res.status(401).json({ message: 'Revoked credentials' })
    const id = user[AUTH_USER_FIELD_ID_FOR_JWT]
    if (!id) return res.status(401).json({ message: 'Authorization Format Error' })
    if (USE_OTP) {
      // if (USE_OTP === 'SMS') {
      //   // Generate PIN
      //   const pin = (Math.floor(Math.random() * (999999 - 0 + 1)) + 0).toString().padStart(6, "0")
      //   const ts = new Date() // utc?
      //   // update pin where ts > ?
      //   // set user SMS & send it
      // }
      return res.status(200).json({ otp: id })
    }
    const tokens = await createToken(user) // 5 minute expire for login
    setTokensToHeader(res, tokens)
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('login err', e.toString())
  }
  return res.status(500).json()  
}

const otp = async (req, res) => { // need to be authentication, body { id: '', pin: '123456' }
  try {
    const { id, pin } = req.body
    const user = await findUser({ id })
    if (user) {
      const gaKey = user[AUTH_USER_FIELD_GAKEY]
      if (USE_OTP !== 'TEST' ? otplib.authenticator.check(pin, gaKey) : String(pin) === '111111') { // NOTE: expiry will be determined by authenticator itself
        const tokens = await createToken(user)
        setTokensToHeader(res, tokens)
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
