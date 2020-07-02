
// // Generate Password
const bcrypt = require('bcryptjs')
let password = bcrypt.hashSync('1111', 12)
console.log(password)

// Generate GA OTP Password
const otplib = require('otplib')
const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key
console.log('secret', secret) // save for the user
// const xx = otplib.authenticator.check('111', '12123123123')
// console.log('xx', xx)

// // Generate OTP Path
// const user = 'test'
// const service = 'My Service'
// // const token = authenticator.generate(secret)
// const otpauth = otplib.authenticator.keyuri(user, service, secret)
// console.log('otpauth', otpauth)
// // Make QR Code From OTP Path
// const qrcode = require('qrcode')
// qrcode.toDataURL(otpauth, (err, data) => {
//   if (err) {
//     console.log('Error with QR')
//     return
//   }
//   console.log(data)
// })

// const crypto = require('crypto-js')
// let ct = crypto.enc.Base64.parse('your-cipher-text')
// let iv = crypto.enc.Base64.parse('your-iv')
// let key = crypto.enc.Base64.parse('your-key')
// const decrypt = crypto.algo.AES.createDecryptor(key, { iv })
// const proc = decrypt.process(ct)
// const final = decrypt.finalize()
// const plain = proc.toString(crypto.enc.Utf8) + final.toString(crypto.enc.Utf8)
// console.log(plain)



'use strict';

const crypto = require('crypto');
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector
// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');

const phrase = "who let the dogs out";

var encrypt = ((val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});

var decrypt = ((encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});



encrypted_key = encrypt(phrase);
original_phrase = decrypt(encrypted_key);
