const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs')
const qrcode = require('qrcode')
const otplib = require('otplib')

const keyv = require('./keyv')

const User = require('../models/User')

// TOREMOVE
// const {firestore} = require('../middleware/firebase')
// const SALT_ROUNDS = 12
// const { USE_OTP, KEY_EXPIRY } = require('../config')

// Create a token from a payload 
function createToken(payload, secretKey, options) {
  return jwt.sign(payload, secretKey, options)
}

// Verify the token 
function verifyToken(token, secretKey) {
  try {
    return jwt.verify(token, secretKey)
  } catch (e) {
    return null
  }
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

module.exports = {
  createToken,
  verifyToken,
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
var crypto = require("crypto");

function encryptText(algor, key, iv, text, encoding) {
  var cipher = crypto.createCipheriv(algor, key, iv)
  encoding = encoding || "binary"
  var result = cipher.update(text, "utf8", encoding)
  result += cipher.final(encoding)
  return result
}

function decryptText(algor, key, iv, text, encoding) {
  var decipher = crypto.createDecipheriv(algor, key, iv)
  encoding = encoding || "binary"
  var result = decipher.update(text, encoding)
  result += decipher.final()
  return result;
}


const data = "This is a test"
const password = "hello"
const algorithm = "aes256"

const args = process.argv.slice(3)

data = args[0]
password = args[1]
algorithm = args[2]

console.log("\nText:\t\t" + data)
console.log("Password:\t" + password)
console.log("Type:\t\t" + algorithm)

var hash,key;

if (algorithm.includes("256")) {
	hash = crypto.createHash('sha256')
  hash.update(password)
	key = new Buffer.alloc(32,hash.digest('hex'),'hex');
} else if (algorithm.includes("192")) {
	hash = crypto.createHash('sha192');
  hash.update(password);
	key = new Buffer.alloc(24,hash.digest('hex'),'hex');
} else if (algorithm.includes("128"))
{
	hash = crypto.createHash('md5');
  hash.update(password);
  key = new Buffer.alloc(16,hash.digest('hex'),'hex');
}


const iv=new Buffer.alloc(16,crypto.pseudoRandomBytes(16));
console.log("Key:\t\t"+key.toString('base64'));
console.log("Salt:\t\t"+iv.toString('base64'));

var encText = encryptText(algorithm, key, iv, data, "base64");
console.log("\n================");
console.log("\nEncrypted:\t" + encText);

var decText = decryptText(algorithm, key, iv, encText, "base64");

console.log("\nDecrypted:\t" + decText);
*/