const express = require('express')

const { authUser } = require('../middlewares/auth')
const authController = require('../controllers/auth')

module.exports = express.Router()
  .post('/signup', authController.signup)
  .post('/check-github', authController.checkGithub)
  .get('/logout', authUser, authController.logout)
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
   *                  token:
   *                    type: string
   *                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._l3MQQAq4Py1q9eWoaLomaX8wvSkYNiztEK_OZ1qlFA"
   *                  refresh_token:
   *                    type: integer
   *                    example: 1234567890123
   *        '401':
   *          description: Unauthorized
   *        '403':
   *          description: Forbidden
   *        default:
   *          description: Unexpected error
   */
  .post('/login', authController.login)
  .post('/refresh', authUser, authController.refresh)
  .post('/otp', authUser, authController.otp)
  .get('/me', authUser, authController.me)
