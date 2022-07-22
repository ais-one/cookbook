'use strict'
// TBD use __key instead of key
// table for tables
const express = require('express')
const fs = require('fs')

const { UPLOAD_STATIC, UPLOAD_MEMORY, APP_NAME, APP_PATH } = process.env

const svc = require(`${APP_PATH}/apps/${APP_NAME}/services`) // TBD set the mongodb and knex service

const { validateColumn } = require('esm')(module)('@es-labs/esm/t4t-validate')

// const { authUser } = require('@es-labs/node/auth')
const authUser = async (req, res, next) => next()

const csvParse = require('csv-parse')
const { Parser } = require('json2csv')

const { memoryUpload, storageUpload } = require(APP_PATH + '/common/upload')

const processJson = async (req, res, next) => {
  if (req.files) { // it is formdata
    obj = {}
    for (let key in req.body) {
      const part = req.body[key]
      obj = JSON.parse(part)
    }
    req.body = obj
  }
  next()
}

// __key is reserved property for identifying row in a multiKey table
// | is reserved for seperating columns that make the multiKey
async function generateTable (req, res, next) { // TBD get config info from a table
  try {
    const tableKey = req.params.table // 'books' // its the table name also
    const ref = require(`../apps/${APP_NAME}/tables/${tableKey}.js`) // get table from a file...
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
    return res.status(500).json({ error: e.toString() })
  }
}

function formUniqueKey(table, args) {
  if (table.pk) return table.db === 'knex' ? { [table.name + '.' + table.pk]: args } : { _id: svc.get(table.conn).setId(args) } // return for pk
  const where = {} // return for multiKey
  const val_a = args.split('|')
  if (val_a.length !== table.multiKey.length) return null
  for (let i=0; i<val_a.length; i++) {
    if (!val_a[i]) return null
    const key = table.multiKey[i]
    where[table.db === 'knex' ? table.name + '.' + key : key] = val_a[i]
  }
  return (Object.keys(where).length) ? where : null
}

function mapRelation (key, col) {
  if (col?.ui?.tag !== 'bwc-combobox') return null
  if (col.ui.tag?.valueType === '') return null // no need mapping
  if (col?.ui?.attrs?.multiple) {
    return {
      type: 'manyToMany',      
    }
  } else {
    const table2 = col?.options?.tableName
    const table2Id = col?.options?.key
    const table1Id = key
    const table2Text = col?.options?.text  
    if (table2 && table2Id && table2Text && table1Id) return { type: '1_n', table2, table2Id, table2Text, table1Id }
  }
  return null
}

function kvDb2Col (row, joinCols, linkCols) { // a key value from DB to column
  for (let k in joinCols) {
    const v = joinCols[k]
    row[k] = { key: row[k], text: row[v] }
    delete row[v]
  }
  for (let k in linkCols) {
    row[k] = linkCols[k]
  }
  return row
}

module.exports = express.Router()
  .get('/test', (req, res) => res.send('t4t ok'))

  .get('/config/:table', authUser, generateTable, asyncWrapper(async (req, res) => {
    res.json(req.table) // return the table info...
  }))
  .get('/find/:table', authUser, generateTable, asyncWrapper(async (req, res) => { // page is 1 based
    const { table } = req
    let { page = 1, limit = 25, filters = null, sorter = null, csv = '' } = req.query
    page = parseInt(page) // 1-based
    limit = parseInt(limit)
    // console.log('t4t filters and sort', filters, sorter, table.name, page, limit)
    filters = JSON.parse(filters) // ignore where col === null, sort it 'or' first then 'and' // [ { col, op, val, andOr } ]
    sorter = JSON.parse(sorter) // [ { column, order: 'asc' } ] / [] order = asc, desc
    if (page < 1) page = 1
    let rv = { results: [], total: 0 }
    let rows
    let where = {} // for mongo
    let query = null // for knex
    let sort = []

    if (table.db === 'knex') {
      let columns = [`${table.name}.*`]
      if (table.select) columns = table.select.split(',') // custom columns... TBD need to add table name?

      query = svc.get(table.conn).knex(table.name)
      query = query.where({})

      // query = svc.get(table.conn).knex(table.name).where({})
      // TBD handle filters for joins...
      let prevFilter = {}
      const joinCols = {}
      if (filters && filters.length) for (let filter of filters) {
        const key = filter.key
        const op = filter.op
        const value = op === 'like' ? `%${filter.val}%` : filter.val

        let _key = key
        const col = table.cols[key]
        if (col?.ui?.junction) { // many to many
          // do nothing here 
        } else { // 1 to many, 1 to 1
          const rel = mapRelation(key, table.cols[key])
          if (rel) { // if has relation and is key-value
            if (rel.type === 'manyToMany') {
              // https://stackoverflow.com/questions/14869041/sql-query-on-multiple-tables-one-being-a-junction-table
            } else {
              const { table2, table2Id, table2Text, table1Id } = rel
              query = query.join(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
              const joinCol = table1Id + '_' + table2Text
              joinCols[table1Id] = joinCol
              _key = table2 + '.' + table2Text
            }
          }
        }

        if (prevFilter.andOr || prevFilter.andOr === 'and') query = query.andWhere(_key, op, value)
        else query = query.orWhere(_key, op, value)
        prevFilter = filter
      }
      if (limit === 0 || csv) {
        rows = await query.clone().orderBy(sorter)
        rv.total = rows.length
      } else {
        let total = await query.clone().count()
        rv.total = Object.values(total[0])[0]
        const maxPage = Math.ceil(rv.total / limit)
        if (page > maxPage) page = maxPage

        //xxx const joinCols = {}
        for (let key in table.cols) {
          const col = table.cols[key]
          if (col?.ui?.junction) { // many to many
            // do nothing here 
          } else { // 1 to many, 1 to 1
            const rel = mapRelation(key, table.cols[key])
            if (rel) { // if has relation and is key-value
              if (rel.type === 'manyToMany') {
                // https://stackoverflow.com/questions/14869041/sql-query-on-multiple-tables-one-being-a-junction-table
              } else {
                const { table2, table2Id, table2Text, table1Id } = rel
                //xxx query = query.join(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
                //xxx const joinCol = table1Id + '_' + table2Text
                //xxx joinCols[table1Id] = joinCol
                //xxx
                if (table1Id && !joinCols[table1Id]) {
                  query = query.join(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
                  const joinCol = table1Id + '_' + table2Text
                  joinCols[table1Id] = joinCol
                }
                columns = [...columns, table2 + '.' + table2Text + ' as ' + joinCols[table1Id]] // add a join column
              }
            }
          }
        }
  
        rows = await query.clone().column(...columns).orderBy(sorter).limit(limit).offset((page > 0 ? page - 1 : 0) * limit)
        rows = rows.map((row) => kvDb2Col(row, joinCols))
      }
    } else { // mongo
      // TBD Joins for MongoDB
      //   db.orders.aggregate([
      //     { $match: { <query> } },
      //     { $skip: <positive integer> },
      //     { $limit: <positive integer> },
      //     {
      //        $lookup: {
      //           from: "items",
      //           localField: "item",    // field in the orders collection
      //           foreignField: "item",  // field in the items collection
      //           as: "fromItems"
      //        }
      //     },
      //     { $sort: { <field1>: <sort order>, <field2>: <sort order> ... } },
      //     // { $project: { fromItems: 0 } }
      //  ])
      sort = sorter && sorter.length ? [ [sorter[0].column, sorter[0].order === 'asc' ? 1 : -1] ] : []
      const or = [] // { "$or" : [] }
      const and = [] // { "$and" : [] }
      for (filter of filters) {
        const key = filter.key
        const op = filter.op
        // TRANSFORM INPUT
        const val = table.cols[key].type === 'integer' || table.cols[key].type === 'number' ? Number(filter.val)
          : table.cols[key].type === 'datetime' || table.cols[key].type === 'date' || table.cols[key].type === 'time' ? new Date(filter.val)
          : filter.val
        let exp
        if (op === '=') exp = { [key]: val }
        else if (op === 'like') exp = { [key]: { $regex: val, $options: 'i' } }
        else if (op === '!=') exp = { [key]: { $ne: val } }
        else if (op === '>') exp = { [key]: { $gt: val } } //  TBD type casting?...
        else if (op === '>=') exp = { [key]: { $gte: val } }
        else if (op === '<') exp = { [key]: { $lt: val } }
        else if (op === '<=') exp = { [key]: { $lte: val } }
        // TBD empty string? null?
        // else if (op === 'in') exp = {[key]: { $in: val } } // convert val from string to array?
        if (filter.andOr === 'and') and.push(exp)
        else or.push(exp)
      }
      if (or.length) where['$or'] = or
      if (and.length) where['$and'] = and
      // console.log('mongo where', or, and)
      if (limit === 0 || csv) {
        rows = await svc.get(table.conn).mongo.db.collection(table.name).find(where).toArray()
        rv.total = rows.length
      } else {
        rv.total = await svc.get(table.conn).mongo.db.collection(table.name).find(where).count()
        const maxPage = Math.ceil(rv.total / limit)
        if (page > maxPage) page = maxPage
        rows = await svc.get(table.conn).mongo.db.collection(table.name).find(where)
          .sort(sort)
          .skip((page > 0 ? page - 1 : 0) * limit)
          .limit(limit)
          .toArray()
      }
    }
    if (csv) {
      const parser = new Parser({})
      const csvRows = parser.parse(rows)
      return res.json({ csv: csvRows })
    } else {
      rv.results = rows.map(row => { // make column for UI to identify each row
        if (table.pk) {
          row.__key = row[table.pk]
        } else {
          const val = []
          for (let k of table.multiKey) val.push(row[k])
          row.__key = val.join('|')
        }
        return row
      })
      return res.json(rv) 
    }
  }))

  .get('/autocomplete', asyncWrapper(async (req, res) => {
    let rows = {}
    let { dbName, conn, tableName, limit = 20, key, text, search, parentTableColName, parentTableColVal } = req.query
    if (dbName === 'knex') {
      const query = svc.get(conn).knex(tableName).where(key, 'like', `%${search}%`).orWhere(text, 'like', `%${search}%`)
      if (parentTableColName !== undefined && parentTableColVal !== undefined) query.andWhere(parentTableColName, parentTableColVal) // AND filter - OK
      rows = await query.clone().limit(limit) // TBD orderBy
    } else { // mongo
      const filter = {
        $or: [
          { [key]: { $regex: search, $options: 'i' } },
          { [text]: { $regex: search, $options: 'i' } }  
        ]
      }
      if (parentTableColName !== undefined && parentTableColVal !== undefined) filter[parentTableColName] = parentTableColVal // AND filter - OK
      rows = await svc.get(conn).mongo.db.collection(tableName).find(filter)
        .limit(Number(limit)).toArray() // TBD sort
    }
    rows = rows.map(row => ({
      key: row[key],
      text: text ? row[text] : row[key]
    }))
    res.json(rows)
  }))

  .get('/find-one/:table', authUser, generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const where = formUniqueKey(table, req.query.__key)
    if (!where) return res.status(400).json({}) // bad request
    let rv = {}
    if (table.db === 'knex') {
      let columns = [`${table.name}.*`]
      if (table.select) columns = table.select.split(',') // custom columns... TBD need to add table name?
  
      let query = svc.get(table.conn).knex(table.name).where(where)
  
      const joinCols = {}
      const linkCols = {}
      for (let key in table.cols) {
        const col = table.cols[key]
        if (col?.ui?.junction) { // many to many
          const rel = col?.ui?.junction
          const { link, t1, t2, t1id, t2id, t2txt, refT1id, refT2id } = rel
          const sql = `SELECT DISTINCT ${t2}.${t2id},${t2}.${t2txt} FROM ${link} JOIN ${t2} ON ${link}.${refT2id} = ${t2}.${t2id} AND ${link}.${refT1id} = ` + req.query.__key
          // SELECT DISTINCT authors.id,authors.name FROM books_authors JOIN authors on books_authors.authorId = authors.id AND books_authors.bookId = 4
          const links = await svc.get(table.conn).knex.raw(sql)
          linkCols[key] = links.map(item => ({ key: item[t2id], text: item[t2txt] }))
        } else { // 1 to many, 1 to 1
          const rel = mapRelation(key, table.cols[key])
          if (rel) { // if has relation and is key-value
            if (rel.type === 'manyToMany') {
              // https://stackoverflow.com/questions/14869041/sql-query-on-multiple-tables-one-being-a-junction-table
            } else {
              const { table2, table2Id, table2Text, table1Id } = rel
              query = query.join(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
              const joinCol = table1Id + '_' + table2Text
              joinCols[table1Id] = joinCol
              columns = [...columns, table2 + '.' + table2Text + ' as ' + joinCol] // add a join colomn
            }
          }
        }
      }

      rv = await query.column(...columns).first()
      rv = kvDb2Col(rv, joinCols, linkCols)
    } else { // mongodb
      rv = await svc.get(table.conn).mongo.db.collection(table.name).findOne(where)
    }    
    return res.json(rv)  
  }))

  .patch('/update/:table/:id?', authUser, generateTable, storageUpload(UPLOAD_STATIC[0]).any(), processJson, asyncWrapper(async (req, res) => {
    const { body, table } = req
    const where = formUniqueKey(table, req.query.__key)
    let count = 0
    if (!where) return res.status(400).json({}) // bad request

    const links = []

    for (let key in table.cols) { // add in auto fields
      const { rules, type } = table.cols[key]
      if (rules) {
        const invalid = validateColumn(rules, type, key, body)
        if (invalid) return res.status(400).json({ error: `Invalid ${key} - ${invalid}` })
      }

      const col = table.cols[key]
      if (col?.ui?.writeType) body[key] = body[key][col.ui.writeType] // select a value from object
      if (col.auto && col.auto === 'user') {
        body[key] = 'TBD USER ID'
      } else if (col.auto && col.auto === 'ts') {
        body[key] = (new Date()).toISOString()
      } else {
        // TRANSFORM INPUT
        body[key] = table.cols[key].type === 'integer' || table.cols[key].type === 'number' ? Number(body[key])
        : table.cols[key].type === 'datetime' || table.cols[key].type === 'date' || table.cols[key].type === 'time' ? (body[key] ? new Date(body[key]) : null)
        : body[key]
      }
      if (col?.ui?.junction) { // process for junction/link table column
        const { link, refT1id, refT2id } = col.ui.junction
        const ids = body[key].map(item => ({ [refT1id]: req.query.__key, [refT2id]: item.key }))
        links.push({
          link, ids, refT1id, // === req.query.__key
        })
        delete body[key] // also remove this column from the body...
      }
    }
    // return res.json({ count: 1 })

    if (table.db === 'knex') {
      // transaction and promise all
      count = await svc.get(table.conn).knex(table.name).update(body).where(where)
      // const promises = []
      for (let item of links) {
        await svc.get(table.conn).knex(item.link).where(item.refT1id, req.query.__key).delete() // test if all authors removed
        await svc.get(table.conn).knex(item.link).insert(item.ids)  
      }
      if (!count) {
        // do insert ?
      }
    } else { // mongodb
      try {
        if (body._id) delete body._id
        await svc.get(table.conn).mongo.db.collection(table.name).updateOne(where, { $set: body })
      } catch (e) {
        console.error(e.toString())
      }
    }
    return res.json({count})
  }))

  .post('/create/:table', authUser, generateTable, storageUpload(UPLOAD_STATIC[0]).any(), processJson, asyncWrapper(async (req, res) => {
    const { table, body } = req
    for (let key in table.cols) {
      const { rules, type } = table.cols[key]
      if (rules) {
        const invalid = validateColumn(rules, type, key, body)
        if (invalid) return res.status(400).json({ error: `Invalid ${key} - ${invalid}` })
      }

      const col = table.cols[key]
      if (col?.ui?.writeType) body[key] = body[key][col.ui.writeType] // select a value from object
      if (col.auto && col.auto === 'user') {
        body[key] = 'TBD USER ID'
      } else if (col.auto && col.auto === 'ts') {
        body[key] = (new Date()).toISOString()
      } else {
        // TRANSFORM INPUT
        body[key] = table.cols[key].type === 'integer' || table.cols[key].type === 'number' ? Number(body[key])
        : table.cols[key].type === 'datetime' || table.cols[key].type === 'date' || table.cols[key].type === 'time' ? (body[key] ? new Date(body[key]) : null)
        : body[key]
      }
      if (col.auto && col.auto === 'pk' && key in body) delete body[key]
    }

    let rv = null
    if (table.db === 'knex') {
      let query = svc.get(table.conn).knex(table.name).insert(body)
      if (table.pk) query = query.returning(table.pk)
      rv = await query.clone()
      if (rv && rv[0]) { // id
        // disallow link tables input... for creation
      }
    } else { // mongodb
      await svc.get(table.conn).mongo.db.collection(table.name).insertOne(body) // rv.insertedId, rv.result.ok
    }
    return res.status(201).json(rv)
  }))

  .post('/remove/:table', authUser, generateTable, asyncWrapper(async (req, res) => {
    const { table } = req
    const { ids } = req.body
    if (!table.delete) return res.status(400).json({ error: 'Delete not allowed' })
    if (table.delete !== -1 && ids.length > table.delete) return res.status(400).json({ error: `Select up to ${table.delete} items` })
    if (ids.length < 1) return res.status(400).json({ error: 'No item selected' })

    // TBD delete relations junction, do not delete if value is in use...

    if (table.pk) { // delete using pk
      if (table.db === 'knex')
        await svc.get(table.conn).knex(table.name).whereIn('id', ids).delete()
      else
        await svc.get(table.conn).mongo.db.collection(table.name).deleteMany({ _id: { $in: ids.map(id => svc.get(table.conn).setId(id)) } })
    } else { // delete using keys
      const keys = ids.map(id => {
        let id_a = id.split('|')
        const multiKey = {}
        for (let i=0; i<id_a.length; i++) {
          const keyName = table.multiKey[i]
          multiKey[keyName] = id_a[i]
        }
        if (table.db === 'knex') {
          return svc.get(table.conn).knex(table.name).where(multiKey).delete() 
        } else {          
          return { deleteOne: { "filter": multiKey } } // svc.get(table.conn).mongo.db.collection(table.name).deleteOne(multiKey)
        }
      })
      if (table.db === 'knex') {
        await Promise.allSettled(keys)
      } else {
        await db.collection(table.name).bulkWrite(keys) // result: dbRv.result
      }
    }
    return res.json()
  }))

/*
const trx = await svc.get(table.conn).knex.transaction()
for {
  let err = false
  try {
    await svc.get(table.conn).knex(tableName).insert(data).transacting(trx)
  } catch (e) {
    err = true
  }
  if (err) await trx.rollback()
  else await trx.commit()
}
*/

  // Test country collection upload using a csv file with following contents
  // code,name
  // zzz,1234
  // ddd,5678
  .post('/upload/:table', authUser, generateTable, memoryUpload(UPLOAD_MEMORY[0]).single('csv-file'), async (req, res) => { // do not use asyncWrapper
    const { table } = req
    const csv = req.file.buffer.toString('utf-8')
    const output = []
    let errors = []
    let keys = []
    let currLine = 0
    csvParse(csv)
      .on('error', (e) => console.error(e.message))
      .on('readable', function () {
        let record
        while ( (record = this.read()) ) {
          currLine++
          if (currLine === 1) {
            keys = [...record]
            continue // ignore first line
          }
          if (record.length === table.nonAuto.length) { // ok
            if (record.join('')) {
              // TBD format before push?
              output.push(record)
            } else {
              errors.push({ currLine, data: record.join(','), msg: 'Empty Row' })
            }
          } else {
            errors.push({ currLine, data: record.join(','), msg: 'Column Count Mismatch' })
          }
        }
      })
      .on('end', async () => {
        let line = 0
        const writes = []
        for (let row of output) {
          line++
          try {
            // TBD: also take care of auto populating fields?
            // TBD: should add validation here
            const obj = {}
            for (let i=0; i<keys.length; i++) {
              obj[ keys[i] ] = row[i]
            }
            if (table.db === 'knex') {
              writes.push(svc.get(table.conn).knex(table.name).insert(obj))
            } else {
              writes.push(svc.get(table.conn).mongo.db.collection(table.name).insertOne(obj))
            }
          } catch (e) {
            errors.push({ line, data: row.join(','), msg: 'Caught exception: ' + e.toString() })
          }
        }
        await Promise.allSettled(writes)
        return res.status(200).json({ errorCount: errors.length, errors })
      })
  })

  // delete file
  // export async function deleteFile(filePath) {
  //   fs.unlink(filePath, e => {
  //     if (e) console.log(e)
  //     else console.log(filePath +' deleted!')
  //   })  
  // }
