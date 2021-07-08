'use strict'
const { revokeToken, logout, login, otp } = require('@es-labs/node/auth')

const express = require('express')
const { authUser, authRefresh } = require('@es-labs/node/auth')

module.exports = express.Router()
  /**
   * @swagger
   * /api/auth/login:
   *    post:
   *      tags:
   *        - "Auth"
   *      description: Login
   *      responses:
   *        '200':
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                properties:
   *                  access_token:
   *                    type: string
   *                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._l3MQQAq4Py1q9eWoaLomaX8wvSkYNiztEK_OZ1qlFA"
   *                  refresh_token:
   *                    type: string
   *                    example: "ey...."
   *        '401':
   *          description: Unauthorized
   *        '403':
   *          description: Forbidden
   *        default:
   *          description: Unexpected error
   */
  .post('/login', login)
  .post('/otp', otp)
  .post('/refresh', authRefresh)
  .get('/logout', logout)
  .get('/verify', authUser, asyncWrapper( async (req, res) => res.json({}) ))
  .get('/me', authUser, (req, res) => {
    try {
      const { id } = req.decoded
      // you can also get more user information from here from a datastore
      return res.status(200).json({ user: id, ts: Date.now() })
    } catch (e) {
      return res.status(500).json({ message: e.toString() })
    }
  })
  .post('/signup', (req, res) => {
    // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
    res.status(201).end()
  })
