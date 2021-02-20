const { bcrypt } = require('@es-labs/node/auth')

// // Generate Password
// let password = bcrypt.hashSync('tech@!@#', 12)
let password = bcrypt.hashSync(password, 12)
console.log(password)
// process.exit(0)
// Generate GA OTP Password
// const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key
// console.log('secret', secret) // save for the user
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
