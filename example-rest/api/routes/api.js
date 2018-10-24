const express = require('express')
const apiRoutes = express.Router()

const {authUser} = require('../helpers')

const Book = require('../models/Book')
const Author = require('../models/Author')
const Page = require('../models/Page')

apiRoutes
  .get('/books', authUser, async (req,res) => {
    // Book.
    const books = await Book.query()
      .skipUndefined()
      // // For security reasons, limit the relations that can be fetched.
      // .allowEager('[pets, parent, children.[pets, movies.actors], movies.actors.pets]')
      // .eager(req.query.eager)
      // .where('category', '=', req.query.category)
      // .where('firstName', 'like', req.query.firstName)
      // .orderBy('name')
      // // Order eagerly loaded pets by name.
      // .modifyEager('[pets, children.pets]', qb => qb.orderBy('name'));

    res.send(books);

    res.status(500).json(books)
  })

  .post('/books/:id/pages', async (req, res) => { // add page to book
    const book = await Book.query().findById(req.params.id);
    if (!book) {
      return res.status(404).json()
    }
    const page = await person.$relatedQuery('pages').insert(req.body);
    res.status(201).json(page)
  })
  .patch('/pages/:id', async (req, res) => { // edit a page
    const page = await Page.query().patchAndFetchById(req.params.id, req.body);
    res.status(200).json(page)
  })

  .delete('/books/:id', async (req, res) => {
    await Book.query().deleteById(req.params.id)
  })
  .delete('/authors/:id', async (req, res) => {
    await Author.query().deleteById(req.params.id)
  })
  .delete('/pages/:id', async (req, res) => {
    await Page.query().deleteById(req.params.id)
  })

module.exports = apiRoutes
