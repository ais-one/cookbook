const express = require('express')

const { authUser } = require('../middlewares/auth')

const Book = require('../models/Book')
// const Author = require('../models/Author')
const Page = require('../models/Page')

const { transaction } = require('objection')
const knex = Book.knex() // You can access `knex` instance anywhere you want.  One way is to get it through any model.

module.exports = express.Router()
  .post('/', authUser, async (req,res) => {
    try {
      console.log(req.body.authorIds)
      const { authorIds, ...data } = req.body
      console.log(data)
      try {
        trx = await transaction.start(knex)
        const book = await Book.query(trx).insert(data)
        await Promise.all(
          authorIds.map(async authorId => {
            await book.$relatedQuery('authors', trx).relate(authorId) // rename 'authors' to Authors
          })
        )      
        await trx.commit()
        if (book) return res.status(201).json(book)
      } catch (e) {
        await trx.rollback()    
        console.log(e)
      }
      res.status(201).json()
    } catch (e) {
      console.log(e.toString())
    }
    return res.status(500).json()
  })
  .patch('/:id', authUser, async (req,res) => {
    let trx
    const { name, categoryId, authorIds } = req.body
    try {
      trx = await transaction.start(knex)
      const book = await Book.query(trx).findById(req.params.id)
      await book.$relatedQuery('authors', trx).unrelate().where('bookId', req.params.id) // rename 'authors' to Authors
      await Promise.all(
        authorIds.map(async authorId => {
          await book.$relatedQuery('authors', trx).relate(authorId)
        })
      )
      // only for Postgresql - await book.$relatedQuery('authors', trx).relate(authorIds) // rename 'authors' to Authors
      await Book.query(trx).patchAndFetchById(req.params.id, { name, categoryId })
      await trx.commit()
      return res.status(200).json(book)
    } catch (e) {
      await trx.rollback()    
      console.log(e)
    }
    return res.status(500).json()
  })
  .get('/:id', authUser, async (req, res) => {
    try {
      const book = await Book.query().findById(req.params.id)
        .select('books.*', 'category.name as categoryName')
        .joinRelated('category')
        .withGraphFetched('[pages, authors]') // show pages
        .modifyGraph('pages', builder => {
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
  .get('/', authUser, async (req,res) => {
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const name = req.query.name ? req.query.name : ''
      const categoryId = req.query.categoryId ? req.query.categoryId : ''
      const sort = req.query.sort ? req.query.sort : ''
      const qb = Book.query()
      if (name) qb.where('books.name', 'like', `%${name}%`)
      if (categoryId) qb.where('books.categoryId', '=', categoryId)
      if (!sort) qb.orderBy('created_at', 'desc')
      else { // TBD need to improve on this...
        sort_a = sort.split(';')
        for (let kv of sort_a) {
          kv_a = kv.split(',')
          qb.orderBy(kv_a[0], kv_a[1])
        }
      }
        // .orderBy
        // .page(page, limit)
        // .joinRelated('category') // NEED TO GET THIS TO WORK
        // select("books.name, category.name")
        // .joinRelated("[category]")
        // .eager('category') // OK
        // .select('books.*', 'category.name as categoryName')
        // .join('categories', 'books.categoryId', 'categories.id')
      const books = await qb.select(
          'books.*',
          'category.name as categoryName',
          Book.relatedQuery('pages').count().as('pageCount'),
          Book.relatedQuery('authors').count().as('authorCount')
          )
        // .orderBy('updated_at', 'desc')
        .joinRelated('category')
        .page(page, limit)
      // console.log(books[0])
      return res.status(200).json(books)  
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .get('/:id/pages', authUser, async (req, res) => { // get pages of a book
    try {
      const limit = req.query.limit ? req.query.limit : 2
      const page = req.query.page ? req.query.page : 0
      const pages = await Page.query()
        .where('bookId', req.params.id)
        // .orderBy('updated_at', 'desc')
        .page(page, limit)
      return res.status(200).json(pages)
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .post('/:id/pages', authUser, async (req, res) => { // add page to book
    try {
      const book = await Book.query().findById(req.params.id)
      if (!book) return res.status(404).json()
      const page = await book.$relatedQuery('pages').insert(req.body) // replace 'pages' with Page
      return res.status(201).json(page)
    } catch (e) { console.log(e) }
    return res.status(500).json()
  })
  .post('/:id/authors/:authorId', authUser, async (req, res) => { // relate author to book - set unique index to prevent duplicates... - IS THIS USED?
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
  .delete('/:id/authors/:authorId', authUser, async (req, res) => { // unrelate author from book - IS THIS USED?
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
  .delete('/:id', authUser, async (req, res) => {
    try {
      trx = await transaction.start(knex)
      const book = await Book.query(trx).findById(req.params.id)
      await book.$relatedQuery('authors', trx).unrelate()
      await Book.query(trx).deleteById(req.params.id)
      await trx.commit()
      res.status(200).json()
    } catch (e) {
      await trx.rollback()
      res.status(500).json()
      console.log('delete book', e.toString())
    }
  })
