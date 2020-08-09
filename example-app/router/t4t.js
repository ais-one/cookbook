// table for tables
const express = require('express')
const Model = require(LIB_PATH + '/services/db/objection').get()
const knex = Model.knex()

const mongo = require(LIB_PATH + '/services/db/mongodb')
const ObjectID = require('mongodb').ObjectID

const csvParse = require('csv-parse')
// const { authUser } = require('../middlewares/auth')
const multer = require('multer')
const { Parser } = require('json2csv')
const upload = multer({
  storage: multer.memoryStorage() 
})

// key is reserved property for identifying row in a multiKey table
// | is reserved for seperating columns that make the multiKey

async function generateTable (req, res, next) {
  // TBD get config info from a table
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
      if (cols[key].required) req.table.required.push(key)
    }
    // console.log(req.table)
    return next()
  } catch (e) {
    res.status(500).json({ e: e.toString() })
  }
}

function formUniqueKey(table, args) {
  if (table.pk) return table.db === 'knex' ? { [table.pk]: args } : { _id: new ObjectID(args) } // return for pk
  const where = {} // return for multiKey
  for (let col of table.multiKey) {
    if (args[col]) where[col] = args[col]
    else return null
  }
  return (Object.keys(where).length) ? where : null
}

module.exports = express.Router()
  .get('/test', (req, res) => res.send('t4t ok'))

  .get('/config/:table', generateTable, asyncWrapper(async (req, res) => {
    res.json(req.table) // return the table info...
  }))
  .get('/find/:table', generateTable, asyncWrapper(async (req, res) => { // page is 1 based
    const { table } = req
    let { page = 1, limit = 25, filters = null, sorter = null, csv = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    // console.log('t4t filters and sort', filters, sorter, table.name, page, limit)
    filters = JSON.parse(filters) // ignore where col === null, sort it 'or' first then 'and' // [ { col, op, val, andOr } ]
    sorter = JSON.parse(sorter) // [ { column, order } ]
    if (page < 1) page = 1
    let rv = { results: [], total: 0 }
    let rows
    let where = {} // for mongo
    let query = null // for knex

    if (table.db === 'knex') {
      query = knex(table.name).where({})
      prevFilter = {}
      if (filters && filters.length) for (filter of filters) {
        const key = filter.col
        const op = filter.op
        const value = op === 'like' ? `%${filter.val}%` : filter.val
        if (prevFilter.andOr || prevFilter.andOr === 'and') query = query.andWhere(key, op, value)
        else query = query.orWhere(key, op, value)
        prevFilter = filter
      }
    } else { // mongo - TBD
      // const query = { "$or" : [] }
    }

    if (limit === 0 || csv) {
      if (table.db === 'knex') {
        rows = await query.clone().orderBy(sorter)
        rv.total = rows.length
      } else { // mongo
        rows = await mongo.db.collection(table.name).find(where).toArray()
        rv.total = rows.length
      }
    } else {
      if (table.db === 'knex') {
        let total = await query.clone().count()
        rv.total = Object.values(total[0])[0]
        const maxPage = Math.ceil(rv.total / limit)
        if (page > maxPage) page = maxPage
        rows = await query.clone().orderBy(sorter).limit(limit).offset((page > 0 ? page - 1 : 0) * limit)
      } else { // mongo
        rv.total = await mongo.db.collection(table.name).find(where).count()
        const maxPage = Math.ceil(rv.total / limit)
        if (page > maxPage) page = maxPage
        rows = await mongo.db.collection(table.name).find(where) // TBD sort
          .skip((page > 0 ? page - 1 : 0) * limit)
          .limit(limit)
          .toArray()
      }
    }
    if (csv) {
      const parser = new Parser({})
      const csv = parser.parse(rows)
      return res.json({csv})
    } else {
      rv.results = rows.map(row => { // make column for UI to identify each row
        if (table.pk) {
          row.key = row[table.pk]
        } else {
          const val = []
          for (let k of table.multiKey) val.push(row[k])
          row.key = val.join('|')
        }
        return row
      })
      return res.json(rv) 
    }
  }))

  .get('/autocomplete', asyncWrapper(async (req, res) => {
    let { tableName, limit = 20, key, value } = req.query
    let rows = {}
    if (table.db === 'knex') {
      const query = knex(tableName).where(key, 'like', `%${value}%`)
      rows = await query.clone().limit(limit) // TBD orderBy
    } else { // mongo
      rows = await mongo.db.collection(tableName).find({ [key]: { $regex: value, $options: 'i' } })
        .limit(limit).toArray() // TBD sort
    }
    rows = rows.map(row => ({
      key: row[key],
      txt: row[key]
    }))
    res.json(rows)
  }))

  .get('/find-one/:table/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const { id } = req.params
    const where = formUniqueKey(table, id || req.query)
    if (!where) return res.status(400).json() // bad request
    let rv = {}
    if (table.db === 'knex') {
      rv = await knex(table.name).where(where).first()
    } else { // mongodb
      rv = await mongo.db.collection(table.name).findOne(where) // { _id: new ObjectID(id) }
    }    
    return res.json(rv)
  }))

  .patch('/update/:table/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { body, table } = req
    const { id } = req.params
    const where = formUniqueKey(table, id || req.query)
    let count = 0
    if (!where) return res.status(400).json() // bad request

    for (let key in table.cols) { // add in auto fields
      const col = table.cols[key]
      if (col.auto && col.auto === 'user') body[key] = 'TBD USER ID'
      if (col.auto && col.auto === 'ts') body[key] = new Date
      // do other transforms if necessary
    }

    if (table.db === 'knex') {
      count = await knex(table.name).update(body).where(where)
      if (!count) {
        // do insert ?
      }
    } else { // mongodb
      await mongo.db.collection(table.name).updateOne(where, { $set: body })
    }
    res.json({count})
  }))

  .post('/create/:table', generateTable, asyncWrapper(async (req, res) => {
    const { table, body } = req
    for (let key in table.cols) {
      const col = table.cols[key]
      if (col.auto && col.auto === 'user') body[key] = 'TBD USER ID'
      if (col.auto && col.auto === 'ts') body[key] = new Date
      // do other transforms if necessary
    }

    let rv = 0
    if (table.db === 'knex') {
      rv = await knex(table.name)
        // .returning('id')
        .insert(body)
    } else { // mongodb
      await mongo.db.collection(table.name).insertOne(body) // rv.insertedId, rv.result.ok
    }
    res.status(201).json(rv)
  }))

  .post('/remove/:table', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const { ids } = req.body
    if (ids.length > 1000) return res.status(400).json({ error: 'Select up to 1000 items' })
    if (ids.length < 1) return res.status(400).json({ error: 'No item selected' })
    if (table.pk) { // delete using pk
      if (table.db === 'knex')
        await knex(table.name).whereIn('id', ids).delete()
      else
        await mongo.db.collection(table.name).deleteMany({ _id: { $in: ids.map(id => new ObjectID(id)) } })  
    } else { // delete using keys
      const keys = ids.map(id => {
        id_a = id.split('|')
        const multiKey = {}
        for (let i=0; i<id_a.length; i++) {
          const keyName = table.multiKey[i]
          multiKey[keyName] = id_a[i]
        }
        if (table.db === 'knex') {
          return knex(table.name).where(multiKey).delete() 
        } else {
          // return mongo.db.collection(table.name).deleteOne(multiKey)
          return {
            deleteOne: {
              "filter": multiKey
            }
          }            
        }
      })
      if (table.db === 'knex') {
        await Promise.allSettled(keys)
      } else {
        const dbRv = await db.collection(table.name).bulkWrite(keys)
        // result: dbRv.result
      }
    }
    res.json()
  }))

  .post('/upload/:table', generateTable, upload.single('file'), asyncWrapper(async (req, res) => {
    const { table } = req
    const csv = req.file.buffer.toString('utf-8')
    const output = []
    let errors = []
    let currLine = 0
    csvParse(csv)
      .on('error', (e) => {
        console.log(e.message)
      })
      .on('readable', () => {
        let record
        while ( (record = this.read()) ) {
          currLine++
          if (currLine === 1) continue // ignore first line
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
      .on('end', () => {
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
