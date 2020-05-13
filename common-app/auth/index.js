const jwt = require('jsonwebtoken')
const { JWT_ALG, JWT_SECRET, jwtCerts, HTTPONLY_TOKEN, JWT_EXPIRY, JWT_REFRESH_EXPIRY, JWT_REFRESH_STORE } = require('../config')

// TBD getToken - checked for revoked token? such token should not be available in Key-Value storage already
const { setToken, getToken, revokeToken } = require('./' + JWT_REFRESH_STORE)
// algorithm
// expiresIn
// issuer  = 'Mysoft corp' 
// subject  = 'some@user.com'
// audience  = 'http://mysoftcorp.in'
// ip

// Create a token from a payload
async function createToken(payload, options) {
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
  return res.status(401).json({ e: 'Error in token' })
}

module.exports = { createToken, revokeToken, authUser } // getToken, setToken,

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