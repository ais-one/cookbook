const qrcode = require('qrcode')
const otplib = require('otplib')

/*
const bcrypt = require('bcryptjs')
let password = bcrypt.hashSync('jsos87E@', 12)
console.log(password)
*/

const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key
console.log('secret', secret) // save for the user

const user = 'test'
const service = 'My Service'

// const token = authenticator.generate(secret);
const otpauth = otplib.authenticator.keyuri(user, service, secret);
console.log('otpauth', otpauth)


qrcode.toDataURL(otpauth, (err, imageUrl) => {
  if (err) {
    console.log('Error with QR')
    return
  }
  console.log(imageUrl);
})
