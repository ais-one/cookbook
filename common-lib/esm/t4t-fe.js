import * as http from './http.js'

let tableName = ''
let config = null

function setTableName(name) {
  tableName = name
}

// type: string, date, datetime, time, integer, float
// {
//   rules: {
//     min: 0, // string, date, datetime, time, integer, float
//     max: 10, // string, date, datetime, time, integer, float
//     regex: 10, // string
//     gt: 'field', // date, datetime, time, integer, float
//     gte: 'field', // date, datetime, time, integer, float
//     lt: 'field', // date, datetime, time, integer, float
//     lte: 'field', // date, datetime, time, integer, float
//     dec: 2 // float
//   ]
// }

function validate(record) {
  for (const col in record) {
    if (config.cols[col]) {
      const { rules, type } = config.cols[col]
      if (rules) {
        const msg = validateOne(rules, type, col, record)
        if (msg) {
          return { col, msg }
        }
      }
    }
  }
  return null
}

// TBD i18n
// for use with
// - example-app/router/t4t.js
// - example-vite/src/components/CrudTable.vue
function validateOne(rules, type, col, record) {
  let invalid = ''
  for (const rule in rules) {
    if (type === 'string') {
      if (rule === 'min' && record[col].length < rules[rule]) invalid = `need at least ${rules[rule]} characters`
      else if (rule === 'max' && record[col].length > rules[rule]) invalid = `maximum ${rules[rule]} characters`
      else if (rule === 'regex' && !RegExp(rules[rule]).test(record[col])) invalid = `regex ${rules[rule]} failed`
    } else if (['integer', 'decimal', 'datetime', 'date', 'time'].includes(type)) {
      if (rule === 'min' && record[col] < rules[rule]) invalid = `cannot be less than ${rules[rule]}`
      else if (rule === 'max' && record[col] > rules[rule]) invalid = `cannot be more than ${rules[rule]}`
      else if (rule === 'gt' && record[rules[rule]] && !(record[col] > record[rules[rule]])) invalid = `${col} must be > ${rules[rule]}`
      else if (rule === 'gte' && record[rules[rule]] && !(record[col] >= record[rules[rule]])) invalid = `${col} must be >= ${rules[rule]}`
      else if (rule === 'lt' && record[rules[rule]] && !(record[col] < record[rules[rule]])) invalid = `${col} must be < ${rules[rule]}`
      else if (rule === 'lte' && record[rules[rule]] && !(record[col] <= record[rules[rule]])) invalid = `${col} must be <= ${rules[rule]}`
    } else {
      // nothing here...
    }
    if (invalid) break
  }
  return invalid
}

async function getConfig() {
  try {
    const { data } = await http.get('/api/t4t/config/' + tableName)
    if (data) {
      config = data
      // for (const col in config.cols) {
      //   const obj = config.cols[col]
      //   if (obj.table !== 'hide') headerCols.push({ path: col, header: obj.label }) // process table columns
      //   if (obj.filter !== 'hide') filterCols.push(col) // process filters
      // }
      // Object.entries(config.cols) => [ [key, obj], ... ]
    }
    return config
  } catch (e) {
  }
  return null
}

async function find(filters, sorter, page, limit) {
  let rv = {
    results: [],
    total: 0
    // cursor: '' // props.infinite
  }
  try {
    const { data } = await http.get('/api/t4t/find/' + tableName, {
      page,
      limit,
      filters: JSON.stringify(filters), // [{col, op, val, andOr}, ...]
      sorter: JSON.stringify(sorter) // [{ column: '<col_name>', order: 'asc|desc' }, ...]
    })
    rv.results = data.results
    rv.total = data.total
    // rv.cursor = data.cursor
  } catch (e) {
  }
  return rv
}

async function download(filters, sorter) {
  try {
    const { data } = await http.get('/api/t4t/find/' + tableName, {
      page: 0,
      limit: 0,
      csv: 1, // it is a csv
      filters: JSON.stringify(filters),
      sorter: JSON.stringify(sorter)
    })
    return data
  } catch (e) {
    console.log('eee', e.toString())
    return null
  }
}

async function findOne(key) {
  let rv = {}
  try {
    const { data } = await http.get('/api/t4t/find-one/' + tableName, { key })
    rv.key = key
    Object.entries(config.cols).forEach((kv) => {
      const [key, val] = kv
      if (val.edit !== 'hide') {
        rv[key] = data[key]
      }
    })
    return rv
  } catch (e) {
    return null
  }
}

async function create(record) {
  await http.post(`/api/t4t/create/${tableName}`, record)
}

// TBD may need to handle file upload also...
async function update(key, record) {
  await http.patch(`/api/t4t/update/${tableName}`, record, { key })
}

async function remove(items) {
  let ids = []
  const { pk } = config
  if (pk) {
    ids = items.map((item) => item[pk])
  } else {
    ids = items.map((item) => item.key)
  }
  await http.post('/api/t4t/remove/' + tableName, { ids })  
}

// uploads a single for csv processing
async function upload(file) { // the file object - e.g. const file = document.querySelector('mwc-fileupload').getFile()
  if (file === null) return false
  const formData = new FormData()
  formData.append('csv-file', file) // call it file
  // console.log('zzz', formData instanceof FormData)
  // for(const pair of formData.entries()) console.log(pair[0], pair[1])
  await http.post('/api/t4t/upload/' + tableName, formData)

  // formData.append('textdata', JSON.stringify({ name: 'name', age: 25 }))
  // const res = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData
  // })

  // const { id, name, avatar } = record
  // const json = JSON.stringify({ name })
  // // const blob = new Blob([json], { type: 'application/json' })
  // // console.log('json', blob)
  // formData.append('filex', avatar.imageFile) // const { name, size, type } = avatar.imageFile
  // formData.append('docx', json)
  // const { data } = await http.patch(`/api/authors/${id}`, formData,
  //   {
  //     // onUploadProgress: progressEvent => {
  //     //   console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%')
  //     // },
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   }
  // )
}

async function autocomplete (search, col, record) {
  let res = []
  try {
    const { dbName, tableName, limit, key, text, parentTableColName, parentCol } = config.cols[col].options
    const query = { dbName, tableName, limit, key, text, search }
    if (parentTableColName) {
      query.parentTableColName = parentTableColName
      query.parentTableColVal = record[parentCol]
    }
    const { data } = await http.get('/api/t4t/autocomplete', query)
    res = data
  } catch (err) {
    console.log('autocomplete', err.message)
  }
  return res
}

export { setTableName, getConfig, validate, find, findOne, create, update, remove, upload, download, autocomplete }

/*
    const autoComplete = debounce(async (e, col, _showForm) => {
      let res = []
      recordObj[_showForm][col] = e.target.value
      try {
        const { dbName, tableName, limit, key, text, parentTableColName, parentCol } = tableCfg.value.cols[col].options
        const query = { dbName, tableName, limit, key, text, search: e.target.value }
        if (parentTableColName) {
          query.parentTableColName = parentTableColName
          query.parentTableColVal = recordObj[_showForm][parentCol]
        }
        const { data } = await http.get('/api/t4t/autocomplete', query)
        res = data
      } catch (err) {
        console.log('autoComplete', err.message)
      }
      const mwcAc = document.querySelector('mwc-autocomplete.' + col)
      mwcAc.setList(res)
    }, 500)

*/