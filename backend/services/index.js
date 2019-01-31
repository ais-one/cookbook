const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs')
const qrcode = require('qrcode')
const otplib = require('otplib')

const keyv = require('./keyv')

const User = require('../models/User')

// const {firestore} = require('../middleware/firebase')
const SALT_ROUNDS = 12
const { USE_OTP, KEY_EXPIRY } = require('../config')

// Create a token from a payload 
function createToken(payload, secretKey, expiresIn = KEY_EXPIRY) {
  return jwt.sign(payload, secretKey, {expiresIn})
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

module.exports = {
  createToken,
  verifyToken,
  isAuthenticated
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