const express = require('express')
const categoryRoutes = express.Router()

const { authUser } = require('../../middlewares/auth')
const categoryController = require('../controllers/category')

// const Category = require('../models/Category')

categoryRoutes
  .post('/categories', authUser, categoryController.create)
  .patch('/categories/:id', authUser, categoryController.update)
  .get('/categories/:id', authUser, categoryController.findOne)
  .get('/categories', authUser, categoryController.find)

module.exports = categoryRoutes
