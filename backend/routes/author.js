const express = require('express')
const authorRoutes = express.Router()

const { authUser } = require('../middleware/auth')
const Author = require('../models/Author')

authorRoutes
  .post('/authors', authUser, async (req, res) => {
    try {
      const author = await Author.query().insert(req.body)
      if (author) return res.status(201).json(author)  
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/authors/:id', authUser, async (req, res) => {
    try {
      const author = await Author.query().patchAndFetchById(req.params.id, req.body)
      if (author) return res.status(200).json(author)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors/:id', authUser, async (req, res) => {
    try {
      const author = await Author.query().findById(req.params.id)
      if (author) return res.status(200).json(author)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors', authUser, async (req, res) => {
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const search = req.query.search ? req.query.search : ''
      const sort = req.query.sort ? req.query.sort : ''
      console.log('search', search, 'sort', sort, 'end')
      const qb = Author.query()
      qb.page(page, limit)
      if (search) qb.where('name', 'like', `%${search}%`)
      if (!sort) qb.orderBy('created_at', 'desc')
      else { // TBD need to improve on this...
        sort_a = sort.split(';')
        for (let kv of sort_a) {
          kv_a = kv.split(',')
          qb.orderBy(kv_a[0], kv_a[1])
        }
      }

      const authors = await qb

      return res.status(200).json(authors)  
    } catch (e) {
      console.log(e.toString())
      return res.status(500).json()
    }
  })
  .delete('/authors/:id', authUser, async (req, res) => {
    await Author.query().deleteById(req.params.id)
  })

module.exports = authorRoutes
