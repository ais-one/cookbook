const Category = require('../models/Category')

exports.create = async (req, res, next) => {
  try {
    const category = await Category.query().insert(req.body)
    if (category) return res.status(201).json(category)
  } catch (e) { }
  return res.status(500).json()
}

exports.update = async (req, res, next) => {
  try {
    const category = await Category.query().patchAndFetchById(req.params.id, req.body)
    if (category) return res.status(200).json(category)
    else return res.status(404).json()
  } catch (e) { }
  return res.status(500).json()
}

exports.findOne = async (req, res, next) => {
  try {
    const category = await Category.query().findById(req.params.id)
    if (category) return res.status(200).json(category)
    else return res.status(404).json()
  } catch (e) { }
  return res.status(500).json()
}

exports.find = async (req, res, next) => {
  try {
    const limit = req.query.limit ? req.query.limit : 2
    const page = req.query.page ? req.query.page : 0
    const categories = await Category.query()
      // .orderBy('created_at', 'desc')
      .page(page, limit)
    return res.status(200).json(categories)  
  } catch (e) { }
  return res.status(500).json()
}
