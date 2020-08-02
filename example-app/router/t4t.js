// table for tables
const express = require('express')
const Model = require(LIB_PATH + '/services/db/objection').get()
const knex = Model.knex()

// const mongo = require(LIB_PATH + '/services/db/mongodb')

const csvParse = require('csv-parse')
// const { authUser } = require('../middlewares/auth')
const multer = require('multer')
const { Parser } = require('json2csv')
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
      if (cols[key].required) req.table.required.push(key)
    }
    // console.log(req.table)
    return next()
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
  .get('/config/:table', generateTable, asyncWrapper(async (req, res) => {
    res.json(req.table) // return the table info...
  }))
  .get('/find/:table', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    console.log(table)
    return res.json()

    let { page = 1, limit = 2, filters, sorter, csv = '' } = req.query

    console.log('t4t filters and sort', filters, sorter)
    // TBD MongoDB

    filters = JSON.parse(filters)
    // [
    //   {
    //     column
    //     compare
    //     value
    //     andOr
    //   }
    // ]
    sorter = JSON.parse(sorter)
    // [
    //   {
    //     column
    //     order
    //   }
    // ]
    if (page < 1) page = 1
    let rv = { results: [], total: 0 }

    let where = {}

    /* knex
    let query = knex(table.name).where(where)
    prevFilter = {}
    if (filters && filters.length) for (filter of filters) {
      const key = filter.name
      const value = filter.value
      const op = filter.op
      if (op === 'like') {
        if (prevFilter.andOr || prevFilter.andOr === 'AND')
          query = query.andWhere(key, 'like', `%${value}%`)
        else 
        query = query.orWhere(key, 'like', `%${value}%`)
      } else {
        if (prevFilter.andOr || prevFilter.andOr === 'AND')
          query = query.andWhere(key, op, value)
        else 
        query = query.orWhere(key, op, value)
      }
      prevFilter= filter
    }
    let total = await query.clone().count()
    rv.total = Object.values(total[0])[0]
    */

    /* mongo
    try {
      const filter = { }
      userFilter(filter, req.decoded)
      if (!req.query.limit) { // reports / exports
        const { dateStart, dateEnd } = req.query
        filter.orderDateTime = {
          $gte: dateStart + 'T00:00:00',
          $lte: dateEnd + 'T23:59:59'
        }
        const { status = '', vesselName = '', location = '', agencyCode = '', master = '' } = req.query
        rv.results = await mongo.db.collection(table.name).find(filter)
          // .sort({ orderDateTime: -1 })
          // .limit(5000) // just put here
          // .toArray()
        rv.total = rv.results.length
      } else { // real-time ops
        const { page = 0, limit = 25, shortId = '' } = req.query
        if (shortId) filter.shortId = shortId
        if (req.query.jobCat) filter.jobCat = req.query.jobCat.charAt(0).toUpperCase() + req.query.jobCat.slice(1)
        rv.total = await mongo.db.collection('job').find(filter).count()
        rv.results = await mongo.db.collection('job').find(filter)
          .sort({ orderDateTime: -1 })
          .skip(parseInt(page) * parseInt(limit))
          .limit(parseInt(limit))
          .toArray()
      }
    } catch (e) {
      console.log('ERROR: job find', e.toString())
    }

    */

    let rows
    if (parseInt(limit) === 0 || csv) {
      rows = await query.clone().orderBy(sorter)
    } else {
      rows = await query.clone().orderBy(sorter).limit(limit).offset((page > 0 ? page - 1 : 0) * limit)
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
    const query = knex(tableName).where(key, 'like', `%${value}%`)
    let rows = await query.clone().limit(limit) // orderBy
    rows = rows.map(row => {
      return {
        key: row[key],
        txt: row[key]
      }
    })
    res.json(rows)
  }))
  .get('/find-one/:table/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = req.params.id ? { id: req.params.id } : formUniqueKey(table, req.query)
    if (!where) return res.status(400).json() // bad request
    // knex
    const rv = await knex(table.name).where(where).first()
    // mongodb
    // const rv = await mongo.db.collection(table.name).findOne(where) // { _id: new ObjectID(id) }
    return res.json(rv)
  }))
  .patch('/update/:table/:id?', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = req.params.id ? { id: req.params.id } : formUniqueKey(table, req.query)
    let count = 0
    if (!where) return res.status(400).json() // bad request
    // knex
    const { body } = req
    for (let key in table.cols) {
      const col = table.cols[key]
      if (col.auto && col.auto === 'user') body[key] = 'TBD USER ID'
      if (col.auto && col.auto === 'ts') body[key] = new Date
      // do other transforms if necessary
    }
    count = await knex(table.name).update(body).where(where)
    if (!count) {
      // do insert ?
    }
    // mongodb
    // await mongo.db.collection(table.name).updateOne(where, { $set: req.body })
    res.json({count})
  }))
  .post('/create/:table', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    // knex
    const { body } = req
    for (let key in table.cols) {
      const col = table.cols[key]
      if (col.auto && col.auto === 'user') body[key] = 'TBD USER ID'
      if (col.auto && col.auto === 'ts') body[key] = new Date
      // do other transforms if necessary
    }
    const rv = await knex(table.name)
      // .returning('id')
      .insert(body)
    // mongodb
    // const rv = await mongo.db.collection(table.name).insertOne(req.body) // rv.insertedId, rv.result.ok
    res.status(201).json(rv)
  }))
  .post('/remove/:table/:id', generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const { ids } = JSON.parse(req.body.ids)
    if (table.pk) {
      await knex(table.name).whereIn('id', ids).delete()
    } else {
      const promises = ids.map(id => {
        id_a = id.split('|')
        const keys = {}
        for (let i=0; i<id_a.length; i++) {
          const keyName = table.multiKey[i]
          keys[keyName] = id_a[i]
        } 
        return knex(table.name).whereIn(keys).delete()
      })
      await Promise.all(promises) // allSettled
    }
    // knex
    // await mongo.db.collection(table.name).deleteOne(where)
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
