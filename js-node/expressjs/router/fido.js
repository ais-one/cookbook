'use strict'
// If using nip.io, need to use HTTPS & domain is LAN address + nip.io
// need to set rpID, origin and CORS (in <environment>.env.js)
// careful of all the conversions! :)

// https://webauthn.guide/
// https://github.com/OWASP/SSO_Project
// https://github.com/webauthn-open-source/fido2-lib

const express = require('express')
// NOSONAR const base64url = require('base64url') // TOREMOVE in Node 16 LTS - use Buffer.from('hello world', 'base64url')
const { Fido2Lib } = require("fido2-lib")

const b64_b64url = (inStr) => inStr.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
const b64url_b64 = (inStr) => inStr.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((inStr.length % 4) ? 4 - (inStr.length % 4) : 0)
const b64_b = (inStr) => Buffer.from(inStr, 'base64')
const b_b64 = (buf) => Buffer.from(buf).toString('base64')
const b64url_b = (inStr) => b64_b(b64url_b64(inStr))
const b_b64url = (buf) => b64_b64url(b_b64(buf))

const b_ab = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
const ab_b = (byteArray) => Buffer.from(byteArray)

/* NOSONAR
const test = 'dUNUFx6OPh829nRG9J7JK4wMZ4QvUddT5XUUHIf_jH0'

// NODEJS

const b64_b = window ? (inStr) => Uint8Array.from(atob(inStr), c => c.charCodeAt(0)) : Buffer.from(inStr, 'base64') // base64 encoded utf8
const b_b64 = window ? (buf) => btoa(buf.reduce((data, val)=> data + String.fromCharCode(val), '')) : Buffer.from(buf).toString('base64') // Uint8Array or Buffer

const b64 = b64url_b64(test) // convert base64url to base64
const ab = Buffer.from(b64, 'base64') // convert base64 to array buffer
console.log('ab', ab)

const b64_2 = Buffer.from(ab).toString('base64') // ab.toString('base64') // convert arraybuffer to base64
const b64url = b64_b64url(b64_2)// convert base64 to base64url
console.log('b64url', b64url)
*/

// could also use one or more of the options below,
// which just makes the options calls easier later on:

const rpId = 'localhost' // 192-168-18-8.nip.io
const origin = 'http://localhost:3000' // https://192-168-18-8.nip.io:3000

const f2l = new Fido2Lib({
  timeout: 120000, // 2 minutes
  rpId,
  rpName: "ACME",
  // rpIcon: "https://example.com/logo.png",
  challengeSize: 128,
  attestation: "none",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: "required"
})

let testInfo = { }

// TBD make below scalable
let registerChallenge = '33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w' //  base64url
let validateChallenge = '' // ab

module.exports = express.Router()
  .get('/register', async (req, res) => {
    try {
      const registrationOptions = await f2l.attestationOptions()
      const userId = 'bXl1c2Vy' // base64url // 'aaronjxz' // (convert to Uint8Array on client side)
  
      registrationOptions.challenge = registerChallenge
      registrationOptions.user = {
        id: userId,
        name: 'name-' + userId, // if use email...
        displayName: 'displayName-' + userId,
      }
        res.json(registrationOptions)  
    } catch (e) {
      res.status(500).json({
        error: 'register get',
        message: e.toString()
      })
    }

  })
  .post('/register', async (req, res) => {
    try {
      const regResponse = req.body
      regResponse.rawId = b_ab( b64url_b(regResponse.rawId) )
      // NOSONAR
      // const zz = regResponse.rawId
      // const yy = b_b64url((ab_b(zz)))
      // console.log('bbbbb', regResponse, yy)
  
      const attestationExpectations = {
        challenge: registerChallenge,
        origin,
        factor: 'either'
      }
  
      const regResult = await f2l.attestationResult(regResponse, attestationExpectations)

      // registration complete!
      // save publicKey and counter from regResult to user's info for future authentication calls
      const authnrData = regResult.authnrData
			const credId = authnrData.get("credId") // ArrayBuffer
      const counter = authnrData.get("counter") // int
      const publicKey = authnrData.get("credentialPublicKeyPem") // string

      testInfo = {
        credId, // same as rawId
        counter,
        publicKey
      }
      console.log(credId, counter, publicKey)

      res.json({ msg: 'register ok' })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: 'register post',
        message: e.toString()
      })
    }
  })

  .get('/validate', async (req, res) => {
    try {
      const authnOptions = await f2l.assertionOptions()
      console.log(authnOptions)

      validateChallenge = authnOptions.challenge // store challenge

      authnOptions.challenge = b_b64url(ab_b(authnOptions.challenge))
      const credentialId = b_b64(ab_b(testInfo.credId))
      authnOptions.allowCredentials = []
      authnOptions.allowCredentials.push({ type: "public-key", id: credentialId })
      // {
      //   challenge: ArrayBuffer {
      //     [Uint8Contents]: <93 7c 29 e4 ee b3 56 f9 14 b8 67 8d d0 18 71 8f 54 1d 3a 5f 22 0d b4 1b eb fd 3b 86 3d 1d 79 f0 63 ca 0a c3 42 1c 48 0e 65 fa 45 e2 49 b8 af 92 7a 74 0f 68 b6 1e 5a 06 
      // 59 55 3f 54 c9 16 7b 88 31 0d ed 7f 31 91 d5 7a d4 38 dc f9 e9 53 e1 c7 af 51 c6 fe 9d 82 e9 5e de f2 42 d9 91 15 2f 05 cf 8d f6 5e ... 28 more bytes>,
      //     byteLength: 128
      //   },
      //   timeout: 120000,
      //   rpId: '192-168-18-8.nip.io',
      //   userVerification: 'required'
      // }

      // NOSONAR add
      // allowCredentials: [
      //   { type: "public-key", id: credentialId }
      // ]
      res.json(authnOptions)
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: 'validate get',
        message: e.toString()
      })
    }
  })
  .post('/validate', async (req, res) => {
    try {
      const regResponse = req.body
      regResponse.rawId = b_ab( b64url_b(regResponse.rawId) )

      const assertionExpectations = {
        // Remove the following comment if allowCredentials has been added into authnOptions so the credential received will be validate against allowCredentials array.
        // allowCredentials: [{
        //     id: "lTqW8H/lHJ4yT0nLOvsvKgcyJCeO8LdUjG5vkXpgO2b0XfyjLMejRvW5oslZtA4B/GgkO/qhTgoBWSlDqCng4Q==",
        //     type: "public-key",
        //     transports: ["usb"]
        // }],
        challenge: b_b64url(ab_b(validateChallenge)), // "eaTyUNnyPDDdK8SNEgTEUvz1Q8dylkjjTimYd5X7QAo-F8_Z1lsJi3BilUpFZHkICNDWY8r9ivnTgW7-XZC3qQ", // validateChallenge
        origin,
        factor: "either",
        publicKey: testInfo.publicKey,
        prevCounter: testInfo.counter,
        userHandle: 'test'
      }

      const credentialId = b_b64(ab_b(testInfo.credId))
      assertionExpectations.allowCredentials = []
      assertionExpectations.allowCredentials.push({ type: "public-key", id: credentialId })

      // const authnResult = 
      await f2l.assertionResult(regResponse, assertionExpectations) // will throw on error
      // console.log(authnResult)
      res.json({ msg: 'validate ok' })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        error: 'validate post',
        message: e.toString()
      })
    }

  })
