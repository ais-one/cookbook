const express = require('express')
const { authUser } = require('../middlewares/auth')
const categoryController = require('../controllers/category')

// const Category = require('../models/Category')

module.exports = express.Router()
  .post('/', authUser, categoryController.create)
  .patch('/:id', authUser, categoryController.update)
  .get('/:id', authUser, categoryController.findOne)
  .get('/', authUser, categoryController.find)
