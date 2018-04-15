function exportCsv (csvContent) {
  let encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
  let link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'vessel.csv')
  document.body.appendChild(link) // Required for FF
  link.click()
}

export { exportCsv }
