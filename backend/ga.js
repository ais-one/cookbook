
// // Generate Password
// const bcrypt = require('bcryptjs')
// let password = bcrypt.hashSync('jsos87E@', 12)
// console.log(password)

// Generate GA OTP Password
// const otplib = require('otplib')
const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key
console.log('secret', secret) // save for the user

// // Generate OTP Path
// const user = 'test'
// const service = 'My Service'
// // const token = authenticator.generate(secret)
// const otpauth = otplib.authenticator.keyuri(user, service, secret)
// console.log('otpauth', otpauth)
// // Make QR Code From OTP Path
// const qrcode = require('qrcode')
// qrcode.toDataURL(otpauth, (err, imageUrl) => {
//   if (err) {
//     console.log('Error with QR')
//     return
//   }
//   console.log(imageUrl)
// })
