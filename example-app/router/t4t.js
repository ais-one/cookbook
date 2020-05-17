// table for tables
const express = require('express')
const Model = require('../../common-app/database')
const knex = Model.knex()

// const mongo = require('../../common-app/mongo')
// const ObjectID = require('mongodb').ObjectID

const csvParse = require('csv-parse')

// const { authUser } = require('../middlewares/auth')

const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage() 
})

async function generateTable (req, res, next) {
  try {
    const tableKey = req.params.table // 'books' // its the table name also
    // TOREMOVE const table = t4tCfg.tables[tableKey]
    const ref = require('./tables/' + tableKey + '.js') // get table from a file...
    req.table = JSON.parse(JSON.stringify(ref))
    const cols = req.table.cols
    for (let key in cols) {
      if (cols[key].auto) {
        if (cols[key].auto === 'pk') {
          req.table.pk = key
        } else {
          req.table.auto.push(key)
        }
      } else {
        req.table.nonAuto.push(key)
      }
      if (cols[key].multiKey) req.table.multiKey.push(key)
    }
    // console.log(req.table)
    next()  
  } catch (e) {
    res.status(500).json({ e: e.toString() })
  }
}

function formUniqueKey(table, args) {
  const where = {}
  for (let col of table.multiKey) {
    if (args[col]) where[col] = args[col]
    else return null
  }
  return (Object.keys(where).length) ? where : null
}

module.exports = express.Router()
  .get('/:table', generateTable, asyncWrapper(async (req, res) => {
    res.json(req.table) // return the table info...
  }))
  .get('/t4t/:table/find', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const { page = 1, limit = 2, ...filters } = req.query
    const rv = { results: [], total: 0 }

    console.log('t4t filters', filters)

    // knex
    const query = knex(table.name)
    let total = await query.clone().count()
    rv.total = Object.values(total[0])[0]
    // tbd where, sort
    rv.results = await query.clone().limit(limit).offset((page > 0 ? page - 1 : 0) * limit)

    // mongo
    // const projection = {}
    // rv.total = await mongo.db.collection(table.name).find(filter, projection).count()
    // rv.results = await mongo.db.collection(table.name).find(filter, projection).sort().skip( (Number(page) - 1) * Number(limit) ).limit(Number(limit)).toArray()

    res.json(rv)
  }))
  .get('/t4t/:table/find-one/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = req.params.id ? { id: req.params.id } : formUniqueKey(table, req.query)
    if (!where) return res.status(400).json() // bad request
    // knex
    const rv = await knex(table.name).where(where).first()
    // mongodb
    // const rv = await mongo.db.collection(table.name).findOne(where) // { _id: new ObjectID(id) }
    return res.json(rv)
  }))
  .patch('/t4t/:table/update/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = req.params.id ? { id: req.params.id } : formUniqueKey(table, req.query)
    if (!where) return res.status(400).json() // bad request
    // knex
    const rv = await knex(table.name).update(req.body).where(where)
    // mongodb
    // await mongo.db.collection(table.name).updateOne(where, { $set: req.body })
    res.json(rv)
  }))
  .post('/t4t/:table/create', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    // knex
    const rv = await knex(table.name)
      // .returning('id')
      .insert(req.body)
    // mongodb
    // const rv = await mongo.db.collection(table.name).insertOne(req.body) // rv.insertedId, rv.result.ok
    res.json(rv)
  }))
  .delete('/t4t/:table/delete/:id', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = req.params.id ? { id: req.params.id } : formUniqueKey(table, req.query)
    if (!where) return res.status(400).json() // bad request
    // knex
    await knex(table.name).where(where).delete()
    // await mongo.db.collection(table.name).deleteOne(where)
    res.json()
  }))
  .delete('/t4t/:table/delete-many', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const ids = JSON.parse(req.query.ids) // [1,2,3]
    // knex
    await knex(table.name).whereIn(id, ids).delete()
    // await mongo.db.collection(table.name).delete(where)
    res.json()
  }))

  .post('/t4t/:table/upload', generateTable, upload.single('file'), asyncWrapper(async (req, res) => {
    const { table } = req
    const csv = req.file.buffer.toString('utf-8')
    const output = []
    let errors = []
    let currLine = 0
    csvParse(csv)
      .on('error', function(e) {
        // e.message
      })
      .on('readable', function () {
        let record
        while (record = this.read()) {
          currLine++
          if (currLine == 1) continue // ignore first line
          if (record.length === table.nonAuto.length) { // ok
            if (record.join('')) {
              // if (permissionOk) {
              // } else {
              // }
              // format before push?
              output.push(record)
            } else {
              errors.push({ currLine, data: record.join(','), msg: 'Empty Row' })
            }
          } else {
            errors.push({ currLine, data: record.join(','), msg: 'Incorrenct Column Count' })
          }
        }
      })
      .on('end', function () {
        let line = 0
        for (let row of output) {
          line++
          try {
            // TBD insert to table
            // also take care of auto populating fields
            console.log(output)
          } catch (e) {
            errors.push({ line, data: row.join(','), msg: 'Caught exception: ' + e.toString() })
            res.status(200).json({ errorCount: errors.length })
          }
        }
      })
  }))
