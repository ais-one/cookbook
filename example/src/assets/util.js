function makeCsvRow (csvContent, tmp, rowDelimiter = `\r\n`, fieldSeperator = ';') {
  if (!csvContent) {
    // csvContent += `"id"` // set id as first columns
    let hdrData = 0
    for (let k1 in tmp) {
      // if (tmp.hasOwnProperty(k1) && k1 !== 'id') { // set id as first columns
      if (tmp.hasOwnProperty(k1)) { // set id as first columns
        csvContent += (hdrData ? ',"' : '"') + k1.replace(/"/g, '""') + '"'
        hdrData++
      }
    }
    csvContent += rowDelimiter
  }
  // csvContent += `"${tmp.id}"`
  let colData = 0
  for (let k2 in tmp) {
    // if (tmp.hasOwnProperty(k2) && k2 !== 'id') {
    if (tmp.hasOwnProperty(k2)) {
      let value = ''
      if (typeof tmp[k2] === 'undefined' || !tmp[k2]) {
      } else if (typeof tmp[k2] === 'string') {
        value = tmp[k2]
      } else if (Array.isArray(tmp[k2])) {
        value = JSON.stringify(tmp[k2])
      } else if (typeof tmp[k2] === 'object') {
        value = JSON.stringify(tmp[k2])
      } else {
        try {
          value = tmp[k2].toString()
        } catch (e) { }
      }
      value.replace(/"/g, '""')
      csvContent += (colData ? ',"' : '"') + value + '"'
      colData++
    }
  }
  csvContent += rowDelimiter
  return csvContent
}

function exportCsv (csvContent, filename) {
  let encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

function exportJson (jsonContent, filename) {
  if (typeof jsonContent !== 'string') jsonContent = JSON.stringify(jsonContent)
  let encodedUri = encodeURI('data:text/json;charset=utf-8,' + jsonContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

export { makeCsvRow, exportCsv, exportJson }
