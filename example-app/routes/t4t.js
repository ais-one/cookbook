// table for tables

const express = require('express')
const t4tRoutes = express.Router()
const asyncWrapper = require('../../common-app/asyncWrapper')

// const { authUser } = require('../middlewares/auth')

t4tRoutes
  .get('/t4t/:table', asyncWrapper(async (req, res) => {

  }))

module.exports = t4tRoutes
