const fs = require('fs')
const { HTTPS_CERTS_PATH, JWT_CERTS_PATH } = require('../config')

let jwtCerts
let httpsCerts

console.log('HTTPS_CERTS_PATH: ', HTTPS_CERTS_PATH)
console.log('JWT_CERTS_PATH: ', JWT_CERTS_PATH)

httpsCerts = (HTTPS_CERTS_PATH) ? { key: fs.readFileSync(`${HTTPS_CERTS_PATH}.key`), cert: fs.readFileSync(`${HTTPS_CERTS_PATH}.crt`) } : null
jwtCerts = (JWT_CERTS_PATH) ? { key: fs.readFileSync(`${JWT_CERTS_PATH}.key`), cert: fs.readFileSync(`${JWT_CERTS_PATH}.crt`) } : ''

module.exports = {
  httpsCerts,
  jwtCerts
}