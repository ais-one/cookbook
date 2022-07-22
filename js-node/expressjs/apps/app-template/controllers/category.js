'use strict'

const s = require('../services')

exports.create = async (req, res, next) => {
  try {
    const rv = await s.get('knex1').knex('categories').insert(req.body)
    return res.status(201).json({ id: rv[0] })
  } catch (e) {
    return res.status(500).json({})
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const category = await s.get('knex1').knex('categories').where({ id: req.params.id }).first()
    if (category)
      return res.status(200).json(category)
    else
      return res.status(404).json({})
  } catch (e) {
    return res.status(500).json({ error: e.toString() })
  }
}

exports.update = async (req, res, next) => {
  try {
    const count = await s.get('knex1').knex('categories').where({ id: req.params.id }).update(req.body)
    return res.status(count ? 200 : 404).json({ count })
  } catch (e) {
    return res.status(500).json({ error: e.toString() })
  }
}

exports.find = async (req, res, next) => {
  try {
    const limit = req.query.limit ? req.query.limit : 2
    const page = req.query.page ? req.query.page : 0
    const categories = await s.get('knex1').knex('categories').limit(limit).offset((page > 0 ? page - 1 : 0) * limit)
    return res.status(200).json(categories)  
  } catch (e) {
    console.log('z>>>>>>>>>>>>>>>>', e.toString(), s)
    return res.status(500).json({ error: e.toString() })
  }
}

exports.remove = async (req, res, next) => {
  try {
    const count = await s.get('knex1').knex('categories').where({ id: req.params.id }).delete()
    return res.status(count ? 200 : 404).json({ count })
  } catch (e) {
    return res.status(500).json({ error: e.toString() })
  }
}

