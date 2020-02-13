const express = require('express')
const pageRoutes = express.Router()

const { authUser } = require('../middlewares/auth')
const Page = require('../models/Page')

pageRoutes
  .delete('/pages/:id', authUser, async (req, res) => { // delete page to book
    try {
      // const page = await Page.query().findById(req.params.id)
      // if (!page) return res.status(404).json()
      const deletedRows = await Page.query().deleteById(req.params.id)
      if (deletedRows) return res.status(200).json()
      else return res.status(404).json()
      // return res.status(200).json(page)
    } catch (e) {
      return res.status(500).json() // e.toString()
    }
  })
  .patch('/pages/:id', authUser, async (req, res) => { // edit a page
    try {
      const page = await Page.query().patchAndFetchById(req.params.id, req.body)
      return res.status(200).json(page)
    } catch (e) {
      return res.status(500).json() // e.toString()
    }
  })
  .get('/pages/:id', async (req, res) => { // edit a page
    try {
      const page = await Page.query().findById(req.params.id)
      if (page) return res.status(200).json(page)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })

module.exports = pageRoutes
