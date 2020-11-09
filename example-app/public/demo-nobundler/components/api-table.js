// tableName, keycol, keyval, filters, data / key, { ids }

// if (!tableCfg.value) {
//   const { data } = await http.get('/api/t4t/config/' + props.tableName)
//   tableCfg.value = data
// }
// if (tableCfg.value) {
//   for (const col in tableCfg.value.cols) {
//     const obj = tableCfg.value.cols[col]
//     if (obj.table !== 'hide') headerCols.push({ path: col, header: obj.label }) // process table columns
//     if (obj.filter !== 'hide') filterCols.push(col) // process filters
//   }
//   // Object.entries(tableCfg.value.cols) => [ [key, obj], ... ]
// }


// LIST
// sorter = [] // reset sorter
// if (params.sortOrders && params.sortOrders.length && params.sortOrders[0].direction) {
//   sorter.push({
//     column: params.sortOrders[0].path,
//     order: params.sortOrders[0].direction
//   })
// }
// const { data } = await http.get('/api/t4t/find/' + props.tableName, {
//   page: page.value,
//   limit: rowsPerPage.value,
//   filters: JSON.stringify(keycol.value ? [...filters, { col: keycol.value, op: '=', val: keyval.value, andOr: 'and' }] : filters),
//   sorter: JSON.stringify(sorter)
// })
// const rv = data
// if (rv.results) {
//   // console.log('rv.total', rv.total, rv.results)
//   maxPage.value = Math.ceil(rv.total / rowsPerPage.value)
//   // gridEl.items = rv.results // do not use this, not scalable
//   gridEl.size = rv.total
//   records.value = rv.results
//   if (rv.cursor && props.infinite) page.value = rv.cursor // infinite scroll, set new cursor
//   callback(rv.results)
// }

/*
console.log('item.key', item.key)
const { data } = await http.get('/api/t4t/find-one/' + props.tableName, { key: item.key })
recordObj.edit.key = item.key
Object.entries(tableCfg.value.cols).forEach((kv) => {
  const [key, val] = kv
  if (val.edit !== 'hide') {
    recordObj.edit[key] = data[key]
  }
})



try {
  const { pk } = tableCfg.value
  if (pk) {
    ids = items.map((item) => item[pk])
  } else {
    ids = items.map((item) => item.key)
  }
  // const rv =
  await http.get('/api/t4t/remove/' + props.tableName, { ids })
} catch (e) {
  alert(`Error delete ${e.toString()}`)
}
loading.value = false
refreshData()


      // validate
      const rec = recordObj[showForm.value]
      for (const col in rec) {
        if (tableCfg.value.cols[col]) {
          const { rules, type } = tableCfg.value.cols[col]
          if (rules) {
            const invalid = validate(rules, type, col, rec)
            if (invalid) {
              showForm.value = ''
              return alert(`Invalid ${col} - ${invalid}`)
            }
          }
        }
      }

      if (loading.value) return
      loading.value = true
      try {
        if (showForm.value === 'add') {
          await http.post(`/api/t4t/create/${props.tableName}`, recordObj.add)
        } else {
          const { key, ...data } = recordObj.edit
          await http.patch(`/api/t4t/update/${props.tableName}`, data, { key })
        }
      } catch (e) {
        alert(`Error ${showForm.value} ${e.toString()}`)
      }
      loading.value = false
      showForm.value = '' // close the form
      refreshData()


const csvDownload = async () => {
  console.log('export', keycol.value, filters)
  const { data } = await http.get('/api/t4t/find/' + props.tableName, {
    page: 0,
    limit: 0,
    csv: 1, // it is a csv
    filters: JSON.stringify(keycol.value ? [...filters, { col: keycol.value, op: '=', val: keyval.value, andOr: 'and' }] : filters),
    sorter: JSON.stringify(sorter)
  })
  downloadData(data.csv, 'job.csv', 'text/csv;charset=utf-8;')
}
*/
