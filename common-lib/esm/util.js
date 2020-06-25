function makeCsvRow (csvContent, tmp, rowDelimiter = `\r\n`, fieldSeperator = ';', idName = 'id') { // TBD Make alphbetical order?
  if (!csvContent) {
    csvContent += idName // set id as first columns
    for (let k1 in tmp) {
      if (tmp.hasOwnProperty(k1) && k1 !== idName) { // set id as first columns
        let text = k1.replace(/;/g, ' ')
        text = text.replace(/([A-Z])/g, ' $1')
        text = text.charAt(0).toUpperCase() + text.slice(1) // capitalize the first letter - as an example.
        csvContent += ';' + text
      }
    }
    csvContent += rowDelimiter
  }
  csvContent += `${tmp[idName]}`
  for (let k2 in tmp) {
    if (tmp.hasOwnProperty(k2) && k2 !== idName) {
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
      csvContent += ';' + value.replace(/;/g, ' ')
    }
  }
  csvContent += rowDelimiter
  return csvContent
}

// to be removed
function exportCsv (csvContent, filename) {
  let encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

// to be removed
function exportJson (jsonContent, filename) {
  if (typeof jsonContent !== 'string') jsonContent = JSON.stringify(jsonContent)
  let encodedUri = encodeURI('data:text/json;charset=utf-8,' + jsonContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

// improved download function
function downloadData (content, filename, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type })
  // IE11 & Edge
  if (navigator.msSaveBlob) { // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    navigator.msSaveBlob(blob, filename)
  } else {
    // In FF link must be added to DOM to be clicked
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click() // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(link)
  }
}

export { makeCsvRow, exportCsv, exportJson, downloadData }
