const express = require('express')
const apiRoutes = express.Router()

const { authUser } = require('../middleware/auth')

const Book = require('../models/Book')
const Author = require('../models/Author')
const Page = require('../models/Page')
const Category = require('../models/Category')

const multer = require('multer')
const mongo = require('../services/mongo')
const UPLOAD_PATH = 'uploads/'
const upload = multer({ dest: `${UPLOAD_PATH}` }) // multer configuration


const { transaction } = require('objection')
const knex = Book.knex() // You can access `knex` instance anywhere you want.  One way is to get it through any model.

apiRoutes
  .get('/test', async (req,res) => {
    try {
      results = mongo ? await mongo.db().collection('users').find({}).toArray() : []
      console.log(results)
    } catch (e) {
      console.log(e)
    }
    // console.log('mongo connected:', !!mongo)
    res.status(200).json({ message: 'Test' })
  })
  // test uploads
  .post('/upload', upload.single('avatar'), async (req,res) => { // avatar is form input name
    console.log(req.file, req.body)
    res.status(200).json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), function (req, res, next) {
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

  // authors
  .post('/authors', async (req, res) => {
    try {
      const author = await Author.query().insert(req.body)
      if (author) return res.status(201).json(author)  
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/authors/:id', async (req, res) => {
    try {
      const author = await Author.query().patchAndFetchById(req.params.id, req.body)
      if (author) return res.status(200).json(author)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors/:id', async (req, res) => {
    try {
      const author = await Author.query().findById(req.params.id)
      if (author) return res.status(200).json(author)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/authors', async (req, res) => {
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const search = req.query.search ? req.query.search : ''
      const authors = await Author.query()
        .where('name', 'like', `%${search}%`)
        // .where('bookId', req.params.id)
        // .orderBy
        .page(page, limit)
      return res.status(200).json(authors)  
    } catch (e) { }
    return res.status(500).json()
  })

  // categories
  .post('/categories', authUser, async (req, res) => {
    try {
      const category = await Category.query().insert(req.body)
      if (category) return res.status(201).json(category)
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/categories/:id', authUser, async (req, res) => {
    try {
      const category = await Category.query().patchAndFetchById(req.params.id, req.body)
      if (category) return res.status(200).json(category)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/categories/:id', authUser, async (req, res) => {
    try {
      const category = await Category.query().findById(req.params.id)
      if (category) return res.status(200).json(category)
      else return res.status(404).json()
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/categories', authUser, async (req, res) => {
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const categories = await Category.query().page(page, limit)
      return res.status(200).json(categories)  
    } catch (e) { }
    return res.status(500).json()
  })

  // books
  .post('/books', async (req,res) => {
    try {
      const author = await Author.query().findById(req.body.authorId)
      if (author) {
        const book = await Book.query().insert(req.body)
        if (book) return res.status(201).json(book)
      }
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/books/:id', async (req,res) => {
    let trx
    const { name, categoryId, authorIds } = req.body
    try {
      trx = await transaction.start(knex)
      const book = await Book.query(trx).findById(req.params.id)
      await book.$relatedQuery('authors', trx).unrelate().where('bookId', req.params.id)
      await Promise.all(
        authorIds.map(async authorId => {
          await book.$relatedQuery('authors', trx).relate(authorId)
        })
      )    
      // only for Postgresql - await book.$relatedQuery('authors', trx).relate(authorIds)
      await Book.query(trx).patchAndFetchById(req.params.id, { name, categoryId })
      await trx.commit()
      return res.status(200).json(book)
    } catch (e) {
      await trx.rollback()    
      console.log(e)
    }
    return res.status(500).json()
  })
  .get('/books/:id', async (req, res) => {
    try {
      const book = await Book.query().findById(req.params.id)
        .select('books.*', 'category.name as categoryName')
        .joinRelation('category')
        .eager('[pages, authors]') // show pages
        .modifyEager('pages', builder => {
          // builder.where('age', '>', 10).select('name')
          builder.limit(2)
        })
      // console.log(book.pages.length)
      if (book.authors) book.authorIds = book.authors.map(item => item.id)
      if (book) return res.status(200).json(book)
      else return res.status(404).json()
    } catch (e) { 
      console.log(e)
    }
    return res.status(500).json()
  })
  .get('/books', async (req,res) => {
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const name = req.query.name ? req.query.name : ''
      const categoryId = req.query['category-id'] ? req.query['category-id'] : ''
      const qb = Book.query()
      if (name) qb.where('books.name', 'like', `%${name}%`)
      if (categoryId) qb.where('books.categoryId', '=', categoryId)
        // .orderBy
        // .page(page, limit)
        // .joinRelation('category') // NEED TO GET THIS TO WORK
        // select("books.name, category.name")
        // .joinRelation("[category]")
        // .eager('category') // OK
        // .select('books.*', 'category.name as categoryName')
        // .join('categories', 'books.categoryId', 'categories.id')
      const books = await qb.select(
          'books.*',
          'category.name as categoryName',
          Book.relatedQuery('pages').count().as('pageCount'),
          Book.relatedQuery('authors').count().as('authorCount')
          )
        .joinRelation('category')
        .page(page, limit)
      // console.log(books[0])
      return res.status(200).json(books)  
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .get('/books/:id/pages', async (req, res) => { // get pages of a book
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const pages = await Page.query()
        .where('bookId', req.params.id)
        .page(page, limit)
      return res.status(200).json(pages)
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .post('/books/:id/pages', async (req, res) => { // add page to book
    try {
      const book = await Book.query().findById(req.params.id)
      if (!book) return res.status(404).json()
      const page = await book.$relatedQuery('pages').insert(req.body)
      return res.status(201).json(page)
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .delete('/pages/:id', async (req, res) => { // delete page to book
    try {
      // const page = await Page.query().findById(req.params.id)
      // if (!page) return res.status(404).json()
      const deletedRows = await Page.query().deleteById(req.params.id)
      if (deletedRows) return res.status(200).json()
      else return res.status(404).json()
      // return res.status(200).json(page)
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .patch('/pages/:id', async (req, res) => { // edit a page
    try {
      const page = await Page.query().patchAndFetchById(req.params.id, req.body)
      return res.status(200).json(page)
    } catch (e) { }
    return res.status(500).json()
  })
  .post('/books/:id/authors/:authorId', async (req, res) => { // relate author to book - set unique index to prevent duplicates...
    // unique index does not seem to work...
    try {
      const book = await Book.query().findById(req.params.id)
      if (!book) return res.status(404).json()
      const relatedRows = await book.$relatedQuery('authors').relate(req.params.authorId)
      if (relatedRows) return res.status(201).json()
      else return res.status(404).json()
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .delete('/books/:id/authors/:authorId', async (req, res) => { // unrelate author from book
    try {
      const book = await Book.query().findById(req.params.id)
      if (!book) return res.status(404).json()
      const deletedRows = await book.$relatedQuery('authors').unrelate().where('authorId', req.params.authorId)
      if (deletedRows) return res.status(200).json()
      else return res.status(404).json()
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })

  // deletions
  .delete('/books/:id', async (req, res) => {
    await Book.query().deleteById(req.params.id)
  })
  .delete('/authors/:id', async (req, res) => {
    await Author.query().deleteById(req.params.id)
  })

module.exports = apiRoutes
