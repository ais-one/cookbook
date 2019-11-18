const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    // console.log('missing configuration file, using defaults')
  }
}
console.log('Environment: ', process.env.NODE_ENV)


export const GITHUB_CLIENT_ID = 'a355948a635c2a2066e2'
export const API_URL = 'http://127.0.0.1:3000' // https://127.0.0.1:3000
export const HTTPONLY_TOKEN = true // true, false use HTTPONLY_TOKEN for more security, but needs same domain
export const SAME_ORIGIN = true // true = same origin, false = cors
