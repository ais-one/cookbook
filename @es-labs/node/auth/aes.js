'use strict'

// WIP for encription and decryption using AES

const crypto = require('crypto')

const encryptText = (algor, key, iv, text, encoding) => {
  const cipher = crypto.createCipheriv(algor, key, iv)
  encoding = encoding || 'binary'
  let result = cipher.update(text, 'utf8', encoding)
  result += cipher.final(encoding)
  return result
}

const decryptText = (algor, key, iv, text, encoding) => {
  const decipher = crypto.createDecipheriv(algor, key, iv)
  encoding = encoding || 'binary'
  let result = decipher.update(text, encoding)
  result += decipher.final()
  return result
}

const genIv = () => new Buffer.alloc(16,crypto.pseudoRandomBytes(16))

const genKey = (algorithm, password) => {
  let hash, key
  if (algorithm.includes("256")) {
    hash = crypto.createHash('sha256') // NOSONAR
    hash.update(password)
    key = new Buffer.alloc(32,hash.digest('hex'),'hex')
  } else if (algorithm.includes("192")) {
    hash = crypto.createHash('sha192') // NOSONAR
    hash.update(password);
    key = new Buffer.alloc(24,hash.digest('hex'),'hex')
  } else if (algorithm.includes("128")) {
    hash = crypto.createHash('md5') // NOSONAR
    hash.update(password)
    key = new Buffer.alloc(16,hash.digest('hex'),'hex')
  }
  return key
}

const test_aes = () => {
  const data = 'This is a test'
  const password = 'hello' // NOSONAR
  const algorithm = 'aes256'
  //NOSONAR const args = process.argv.slice(3)
  // data = args[0]
  // password = args[1]
  // algorithm = args[2]
  
  console.log('Text: ' + data)
  console.log('Password: ' + password)
  console.log('Type: ' + algorithm)

  
  const iv = genIv()
  const key = genKey(algorithm, password)
  console.log('Key: ' + key.toString('base64'))
  console.log('Salt: ' + iv.toString('base64'))
  
  const encText = encryptText(algorithm, key, iv, data, 'base64')
  console.log('Encrypted: ' + encText)
  
  const decText = decryptText(algorithm, key, iv, encText, 'base64')
  console.log('Decrypted: ' + decText);  
}

const test_decrypt = () => {
  let ct = crypto.enc.Base64.parse('your-cipher-text')
  let iv = crypto.enc.Base64.parse('your-iv')
  let key = crypto.enc.Base64.parse('your-key')
  const decrypt = crypto.algo.AES.createDecryptor(key, { iv })
  const proc = decrypt.process(ct)
  const final = decrypt.finalize()
  const plain = proc.toString(crypto.enc.Utf8) + final.toString(crypto.enc.Utf8)
  console.log(plain)
}

test_aes()

module.exports = {
  genIv,
  genKey,
  encryptText,
  decryptText
}