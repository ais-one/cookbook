'use strict'
const express = require('express')
const base64url = require('base64url') // TOREMOVE in Node 16 LTS - use Buffer.from('hello world', 'base64url')

const { Fido2Lib } = require("fido2-lib")

/*
const test = 'dUNUFx6OPh829nRG9J7JK4wMZ4QvUddT5XUUHIf_jH0'

// NODEJS
const b64_b64url = (inStr) => inStr.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '')
const b64url_b64 = (inStr) => inStr.replace(/\-/g, '+').replace(/_/g, '/') + '='.repeat((inStr.length % 4) ? 4 - (inStr.length % 4) : 0)
const b64_ab = (inStr) => Buffer.from(inStr, 'base64')
const ab_b64 = (buf) => Buffer.from(buf).toString('base64')

const b64_ab = window ? (inStr) => Uint8Array.from(atob(inStr), c => c.charCodeAt(0)) : Buffer.from(inStr, 'base64') // base64 encoded utf8
const ab_b64 = window ? (buf) => btoa(buf.reduce((data, val)=> data + String.fromCharCode(val), '')) : Buffer.from(buf).toString('base64') // Uint8Array or Buffer



const b64 = b64url_b64(test) // convert base64url to base64
const ab = Buffer.from(b64, 'base64') // convert base64 to array buffer
console.log('ab', ab)

const b64_2 = Buffer.from(ab).toString('base64') // ab.toString('base64') // convert arraybuffer to base64
const b64url = b64_b64url(b64_2)// convert base64 to base64url
console.log('b64url', b64url)
*/

// could also use one or more of the options below,
// which just makes the options calls easier later on:
const f2l = new Fido2Lib({
  timeout: 120000, // 2 minutes
  rpId: "nip.io",
  rpName: "ACME",
  // rpIcon: "https://example.com/logo.png",
  challengeSize: 128,
  attestation: "none",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: "required"
})

let testTnfo = {

}

module.exports = express.Router()
  .get('/register', async (req, res) => {
    const registrationOptions = await f2l.attestationOptions()

    const userId = 'aaronjxz' // (convert to Uint8Array on client side)
    const challenge = base64url('ladies and gentlemen we are floating in space')  // (convert base64url to Uint8Array on client side)

    registrationOptions.challenge = challenge
    registrationOptions.user = {
      id: userId,
      name: 'name-' + userId, // if use email...
      displayName: 'displayName-' + userId,
    }

    // console.log(registrationOptions.user, registrationOptions.challenge)



    // make sure to add registrationOptions.user.id
    // save the challenge in the session information...
    // send registrationOptions to client and pass them in to `navigator.credentials.create()`...
    // get response back from client (clientAttestationResponse)
    
    // const attestationExpectations = {
    //     challenge: "33EHav-jZ1v9qwH783aU-j0ARx6r5o-YHh-wd7C6jPbd7Wh6ytbIZosIIACehwf9-s6hXhySHO-HHUjEwZS29w",
    //     origin: "https://localhost:8443",
    //     factor: "either"
    // }
    // const regResult = await f2l.attestationResult(clientAttestationResponse, attestationExpectations) // will throw on error
    
    // registration complete!
    // save publicKey and counter from regResult to user's info for future authentication calls

    res.json(registrationOptions)
  })
  .post('/register', async (req, res) => {
    res.json(req.body)
  })

  .get('/validate', async (req, res) => {
  })
  .post('/validate', async (req, res) => {
  })
