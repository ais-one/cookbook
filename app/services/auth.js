const jwt = require('jsonwebtoken')
const keyv = require('./keyv')

const { JWT_ALG, JWT_SECRET, jwtCerts } = require('../'+ require('../appname') + '/config')

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

module.exports = {
  createToken,
  revokeToken
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