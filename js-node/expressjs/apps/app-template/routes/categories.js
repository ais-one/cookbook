'use strict'

const express = require('express')
const { authUser } = require('@es-labs/node/auth')
const categoryController = require('../controllers/category')

module.exports = express.Router()
  .get('/healthcheck', (req, res) => res.send('Cat OK'))
  .post('/categories', authUser, categoryController.create)
  .patch('/categories/:id', authUser, categoryController.update)
  .get('/categories/:id', authUser, categoryController.findOne)
  .get('/categories', authUser, categoryController.find)
  .delete('/categories/:id', authUser, categoryController.remove)
  // .delete('/:id', authUser, categoryController.remove)
