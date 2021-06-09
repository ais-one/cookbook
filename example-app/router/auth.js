'use strict'

const express = require('express')

const { authUser } = require('../middlewares/auth')
const authController = require('../controllers/auth')

module.exports = express.Router()
  .post('/signup', authController.signup)
  .get('/check-github', authController.checkGithub)
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
  .post('/login', authController.login)
  .post('/otp', authController.otp)
  .post('/refresh', authUser, authController.refresh)
  .get('/logout', authController.logout)
  .get('/me', authUser, authController.me)
