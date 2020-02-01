const express = require('express')
const authRoutes = express.Router()
const otplib = require('otplib')

const { authUser } = require('../../middlewares/auth')
const authController = require('../controllers/auth')

authRoutes
  .post('/auth/signup', authController.signup)
  .post('/auth/check-github', authController.checkGithub)
  .get('/auth/logout', authUser, authController.logout)
  .post('/auth/login', authController.login)
  .post('/auth/refresh', authUser, authController.refresh)
  .post('/auth/otp', authUser, authController.otp)
  .get('/auth/me', authUser, authController.me)

module.exports = authRoutes
