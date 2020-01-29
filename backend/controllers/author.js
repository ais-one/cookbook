
const Author = require('../models/Author')
const { transaction } = require('objection')
const knex = Author.knex() // You can access `knex` instance anywhere you want.  One way is to get it through any model.

exports.create = async (req, res) => {
  try {
    const author = await Author.query().insert(req.body)
    if (author) return res.status(201).json(author)  
  } catch (e) { }
  return res.status(500).json()
}

exports.update = async (req, res) => {
  try {
    // console.log('express file', req.file)
    const json = JSON.parse(req.body.docx)
    const author = await Author.query().patchAndFetchById(req.params.id, json)
    if (author) return res.status(200).json(author)
    else return res.status(404).json()
  } catch (e) {
    console.log('express error', e.toString())
  }
  return res.status(500).json()
}
exports.findOne = async (req, res) => {
  try {
    const author = await Author.query().findById(req.params.id)
    if (author) return res.status(200).json(author)
    else return res.status(404).json()
  } catch (e) { }
  return res.status(500).json()
}

exports.find = async (req, res) => {
  try {
    const limit = req.query.limit ? req.query.limit : 2
    const page = req.query.page ? req.query.page : 0
    const search = req.query.search ? req.query.search : ''
    const sort = req.query.sort ? req.query.sort : ''
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
    return res.status(500).json()
  }
}

exports.remove = async (req, res) => {
  try {
    trx = await transaction.start(knex)
    const author = await Author.query(trx).findById(req.params.id)
    await author.$relatedQuery('books', trx).unrelate()
    await Author.query(trx).deleteById(req.params.id)
    await trx.commit()
    res.status(200).json()
  } catch (e) {
    await trx.rollback()
    res.status(500).json()
    console.log('delete author', e.toString())
  }
}
