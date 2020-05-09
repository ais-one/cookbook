const express = require('express')

const { authUser } = require('../middlewares/auth')
const authController = require('../controllers/auth')

module.exports = express.Router()
  .post('/signup', authController.signup)
  .post('/check-github', authController.checkGithub)
  .get('/logout', authUser, authController.logout)
  .post('/login', authController.login)
  .post('/refresh', authUser, authController.refresh)
  .post('/otp', authUser, authController.otp)
  .get('/me', authUser, authController.me)
