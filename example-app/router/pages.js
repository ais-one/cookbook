'use strict'

const express = require('express')
const { authUser } = require('@es-labs/node/auth')
const Page = require('../models/Page')

module.exports = express.Router()
  .delete('/:id', authUser, async (req, res) => { // delete page to book
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
  .patch('/:id', authUser, async (req, res) => { // edit a page
    try {
      const page = await Page.query().patchAndFetchById(req.params.id, req.body)
      return res.status(200).json(page)
    } catch (e) {
      return res.status(500).json() // e.toString()
    }
  })
  .get('/:id', async (req, res) => { // edit a page
    try {
      const page = await Page.query().findById(req.params.id)
      if (page) return res.status(200).json(page)
      else return res.status(404).json()
    } catch (e) {
      console.log('error', e.toString())
    }
    return res.status(500).json()
  })
