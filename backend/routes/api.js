const express = require('express')
const apiRoutes = express.Router()

const { authUser } = require('../middleware/auth')

const Book = require('../models/Book')
const Author = require('../models/Author')
const Page = require('../models/Page')

apiRoutes
  // authors
  .post('/authors', async (req, res) => {
    try {
      const author = await Author.query().insert(req.body);
      if (author) return res.status(201).json(author)  
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/authors/:id', async (req, res) => {
    try {
      const author = await Author.query().patchAndFetchById(req.params.id, req.body);
      if (author) return res.status(200).json(author)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors/:id', async (req, res) => { // edit a page
    try {
      const author = await Author.query().findById(req.params.id);
      if (author) return res.status(404).json()
      else return res.status(200).json(author)
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors', async (req, res) => { // edit a page
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const authors = await Author.query()
        // .where
        // .orderBy
        .page(page, limit);
      res.status(200).json(authors)  
    } catch (e) { }
    return res.status(500).json()
  })

  // books
  .post('/books', async (req,res) => {
    try {
      const author = await Author.query().findById(req.body.authorId)
      if (author) {
        const book = await Book.query().insert(req.body);
        if (book) return res.status(201).json(book)
      }
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/books/:id', async (req,res) => {
    try {
      const book = await Book.query().patchAndFetchById(req.params.id, req.body);
      if (book) return res.status(200).json(book)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/books/:id', async (req, res) => {
    try {
      const book = await Book.query().findById(req.params.id)
        .eager('pages')
        .modifyEager('pages', builder => {
          // builder.where('age', '>', 10).select('name');
          builder.limit(2)
        })
      console.log(book.pages.length)
      if (book) return res.status(200).json(book)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/books', async (req,res) => { // need to return authors?
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const books = await Book.query()
        // .where
        // .orderBy
        // .page(page, limit);
        // .joinRelation('category') // NEED TO GET THIS TO WORK
        // select("books.name, categories.name")
        // .joinRelation("[category]")
        // .eager('category') // OK
        // .select('books.*', 'categories.name as catName')
        // .join('categories', 'books.categoryId', 'categories.id')
        .select('books.*', 'category.name as catName')
        .joinRelation('category')

      console.log(books[0])
      return res.status(200).json(books)  
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .post('/books/:id/pages', async (req, res) => { // add page to book
    const book = await Book.query().findById(req.params.id);
    if (!book) {
      return res.status(404).json()
    }
    const page = await book.$relatedQuery('pages').insert(req.body);
    res.status(201).json(page)
  })

  // TBD remove  page from a book

  .patch('/pages/:id', async (req, res) => { // edit a page
    const page = await Page.query().patchAndFetchById(req.params.id, req.body);
    res.status(200).json(page)
  })

  // get pages from a book

  // deletions
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
