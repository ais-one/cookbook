function makeCsvRow (csvContent, tmp, rowDelimiter = `\r\n`, fieldSeperator = ';') {
  if (!csvContent) {
    csvContent += `"id"` // set id as first columns
    for (let k1 in tmp) {
      if (tmp.hasOwnProperty(k1) && k1 !== 'id') { // set id as first columns
        // let text = k1.replace(/;/g, ' ') // ; is used as field delimiter... strip it off
        // text = text.replace(/([A-Z])/g, ' $1')
        // text = text.charAt(0).toUpperCase() + text.slice(1) // capitalize the first letter - as an example.
        // csvContent += ';' + text
        csvContent += ',"' + k1.replace(/"/g, '""') + '"'
      }
    }
    csvContent += rowDelimiter
  }
  csvContent += `"${tmp.id}"`
  for (let k2 in tmp) {
    if (tmp.hasOwnProperty(k2) && k2 !== 'id') {
      let value = ''
      if (typeof tmp[k2] === 'undefined' || !tmp[k2]) {
        // do nothing
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
      csvContent += ',"' + value + '"'
    }
  }
  csvContent += rowDelimiter
  return csvContent
}

function exportCsv (csvContent) {
  let encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'vessel.csv')
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
