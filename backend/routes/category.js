const express = require('express')
const categoryRoutes = express.Router()

const { authUser } = require('../services/auth')
const categoryController = require('../controllers/category')

// const Category = require('../models/Category')

categoryRoutes
  .post('/categories', authUser, categoryController.create)
  .patch('/categories/:id', authUser, categoryController.update)
  .get('/categories/:id', authUser, categoryController.findOne)
  .get('/categories', authUser, categoryController.find)


  // .post('/categories', authUser, async (req, res) => {
  //   try {
  //     const category = await Category.query().insert(req.body)
  //     if (category) return res.status(201).json(category)
  //   } catch (e) { }
  //   return res.status(500).json()
  // })
  // .patch('/categories/:id', authUser, async (req, res) => {
  //   try {
  //     const category = await Category.query().patchAndFetchById(req.params.id, req.body)
  //     if (category) return res.status(200).json(category)
  //     else return res.status(404).json()
  //   } catch (e) { }
  //   return res.status(500).json()
  // })
  // .get('/categories/:id', authUser, async (req, res) => {
  //   try {
  //     const category = await Category.query().findById(req.params.id)
  //     if (category) return res.status(200).json(category)
  //     else return res.status(404).json()
  //   } catch (e) { }
  //   return res.status(500).json()
  // })
  // .get('/categories', authUser, async (req, res) => {
  //   try {
  //     const limit = req.query.limit ? req.query.limit : 2
  //     const page = req.query.page ? req.query.page : 0
  //     const categories = await Category.query()
  //       // .orderBy('created_at', 'desc')
  //       .page(page, limit)
  //     return res.status(200).json(categories)  
  //   } catch (e) { }
  //   return res.status(500).json()
  // })

module.exports = categoryRoutes
