const otplib = require('otplib')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const uuid = require('uuid/v4')
// const qrcode = require('qrcode')
const { JWT_ALG, JWT_SECRET, jwtCerts, HTTPONLY_TOKEN, USE_OTP, OTP_EXPIRY, JWT_EXPIRY, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE ='keyv' } = require('../config')
const { AUTH_USER_FIELD_LOGIN, AUTH_USER_FIELD_PASSWORD, AUTH_USER_FIELD_GAKEY, AUTH_USER_FIELD_ID_FOR_JWT, AUTH_USER_FIELD_GROUPS_FOR_JWT } = require('../config')
const { AUTH_USER_STORE, AUTH_USER_STORE_NAME } = require('../config')


const mongo = require('../services/db/mongodb')
const ObjectID = require('mongodb').ObjectID
const Model = require('../services/db/objection').get()
const knex = Model ? Model.knex() : null

// TBD getToken - check for revoked token? such token should not be available in Key-Value storage already

const { setToken, getToken, revokeToken } = require('./' + JWT_REFRESH_STORE)

// algorithm
// expiresIn
// issuer  = 'Mysoft corp' 
// subject  = 'some@user.com'
// audience  = 'http://mysoftcorp.in'
// ip

const findUser = async (where) => {
  if (AUTH_USER_STORE === 'mongo') {
    if (where.id) where = { _id: new ObjectID(where.id) }
    return await mongo.db.collection(AUTH_USER_STORE_NAME).findOne(where)
  } else if (AUTH_USER_STORE === 'objection') {
    return await knex(AUTH_USER_STORE_NAME).where(where).first()
  }
  return null
}


// Create a token from a payload
const createToken = async (payload, options) => {
  let token
  let refresh_token
  try {
    // console.log('createToken', payload, options)
    options.algorithm = JWT_ALG
    const secretKey = JWT_ALG.substring(0,2) === 'RS' ? jwtCerts.key : JWT_SECRET
    token = jwt.sign(payload, secretKey, options)
    // console.log(token)
    refresh_token = Date.now()
    await setToken(payload.id, refresh_token) // TBD set in DB instead...
  } catch (e) {
    console.log('createToken', e.toString())
  }
  return { token, refresh_token }          
}

const authUser = async (req, res, next) => {
  // console.log('auth express', req.baseUrl, req.path, req.cookies, req.signedCookies)
  let token
  try {
    // if (HTTPONLY_TOKEN) token = req.cookies.token
    // else token = req.headers.authorization.split(' ')[1]
    // console.log(req.path, req.cookies)
    if (req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') token = req.headers.authorization.split(' ')[1]
    }
    if (token) { // matchingToken
      // console.log('token', token)
      // USE_OTP && req.path !== '/otp'
      let result = null
      try {
        const secretKey = JWT_ALG.substring(0, 2) === 'RS' ? jwtCerts.cert : JWT_SECRET
        result = jwt.verify(token, secretKey, { algorithm: [JWT_ALG] }) // and options
        if (!result.verified && !(req.baseUrl + req.path === '/api/auth/otp')) {
          return res.status(401).json({ message: 'Token Verification Error' })
        }
      } catch (e) {
        // const aa = jwt.decode(token)
        // console.log( e.name, aa, (new Date(aa.iat * 1000)).toISOString(), (new Date(aa.exp * 1000)).toISOString(), (new Date(Date.now())).toISOString() )
        if (e.name === 'TokenExpiredError') {
          // console.log('req.path', req.baseUrl + req.path)
          if (req.baseUrl + req.path === '/api/auth/refresh') {
            try {
              // check refresh token & user - always stateful
              const { id, groups, exp } = jwt.decode(token)
              let refreshToken = await getToken(id)
              if (refreshToken) {
                // console.log('ggg', req.baseUrl, req.path, parseInt(Date.now() / 1000) - exp, JWT_REFRESH_EXPIRY, e.toString(), parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY, token)
                if (parseInt(Date.now() / 1000) < exp + JWT_REFRESH_EXPIRY) { // not too expired... exp is in seconds, iat is not used
                  if (refreshToken === req.body.refresh_token) { // ok... generate new access token & refresh token?
                    const tokens = await createToken({ id, verified: true, groups }, { expiresIn: JWT_EXPIRY }) // 5 minute expire for login
                    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
                    return res.status(200).json(tokens)
                  }
                }
              }
            } catch (err) { // use err instead of e (fix no-catch-shahow issue)
              console.log('refreshing auth err', err.toString())
              return res.status(401).json({ message: 'Refresh Error' })
            }
            return res.status(401).json({ message: 'Uncaught Refresh Error' })
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
  return res.status(401).json({ e: 'Error in token' })
}

const logout = async (req, res) => {
  try {
    await revokeToken(req.decoded.id) // clear
    if (HTTPONLY_TOKEN) res.clearCookie('token')
    return res.status(200).json({ message: 'Logged Out' })  
  } catch (e) {
    console.log(e.toSting())
  }
  return res.status(500).json()  
}

const refresh = async (req, res) => {
  // refresh logic all done in authUser
  return res.status(401).json({ message: 'Error token revoked' })
}

const login = async (req, res) => {
  try {
    // console.log(AUTH_USER_FIELD_LOGIN, req.body)
    const user = await findUser({
      [AUTH_USER_FIELD_LOGIN]: req.body[AUTH_USER_FIELD_LOGIN] // email
    })
    const password = req.body[AUTH_USER_FIELD_PASSWORD]

    if (!user) return res.status(401).json({ message: 'Incorrect credentials...' })
    if (!bcrypt.compareSync(password, user[AUTH_USER_FIELD_PASSWORD])) return res.status(401).json({ message: 'Incorrect credentials' })
    if (user.revoked) return res.status(401).json({ message: 'Authorization Revoked' })
    let verified = true
    const id = user[AUTH_USER_FIELD_ID_FOR_JWT] || ''
    const groups = user[AUTH_USER_FIELD_GROUPS_FOR_JWT] || ''
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
    const tokens = await createToken({ id, verified, groups }, { expiresIn: USE_OTP ? OTP_EXPIRY : JWT_EXPIRY }) // 5 minute expire for login
    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('login err', e.toString())
  }
  return res.status(500).json()  
}

const otp = async (req, res) => { // need to be authentication, body { pin: '123456' }
  try {
    const { id, groups } = req.decoded
    const user = await findUser({ id })
    if (user) {
      const { pin } = req.body
      const gaKey = user[AUTH_USER_FIELD_GAKEY]
      const isValid = USE_OTP !== 'TEST' ? otplib.authenticator.check(pin, gaKey) : String(pin) === '111111'
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


module.exports = { findUser, createToken, revokeToken, authUser, logout, refresh, login, otp } // getToken, setToken,

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