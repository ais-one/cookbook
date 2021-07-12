'use strict'

const express = require('express')
const { authUser } = require('@es-labs/node/auth')
const categoryController = require('../controllers/category')

module.exports = express.Router()
  .post('/', authUser, categoryController.create)
  .patch('/:id', authUser, categoryController.update)
  .get('/:id', authUser, categoryController.findOne)
  .get('/', authUser, categoryController.find)
  .delete('/:id', authUser, categoryController.remove)
  // .delete('/:id', authUser, categoryController.remove)
