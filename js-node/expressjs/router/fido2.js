'use strict'
const express = require('express')
const base64url = require('base64url') // TOREMOVE in Node 16 LTS - use Buffer.from('hello world', 'base64url')

const { Fido2Lib } = require("fido2-lib")

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
