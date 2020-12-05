function makeCsvRow(csvContent, tmp, rowDelimiter = `\r\n`, fieldSeperator = ';', idName = 'id') {
  // TBD Make alphbetical order?
  if (!csvContent) {
    csvContent += idName // set id as first columns
    for (const k1 in tmp) {
      // TOREMOVE if (tmp.prototype.hasOwnProperty(k1) && k1 !== idName) {
      if (tmp[k1] && k1 !== idName) {
        // set id as first columns
        let text = k1.replace(/;/g, ' ')
        text = text.replace(/([A-Z])/g, ' $1')
        text = text.charAt(0).toUpperCase() + text.slice(1) // capitalize the first letter - as an example.
        csvContent += ';' + text
      }
    }
    csvContent += rowDelimiter
  }
  csvContent += `${tmp[idName]}`
  for (const k2 in tmp) {
    // TOREMOVE if (tmp.prototype.hasOwnProperty(k2) && k2 !== idName) {
    if (tmp[k2] && k2 !== idName) {
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
        } catch (e) {
          console.log('error', e.toString())
        }
      }
      csvContent += ';' + value.replace(/;/g, ' ')
    }
  }
  csvContent += rowDelimiter
  return csvContent
}

// to be removed
function exportCsv(csvContent, filename) {
  const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

// to be removed
function exportJson(jsonContent, filename) {
  if (typeof jsonContent !== 'string') jsonContent = JSON.stringify(jsonContent)
  const encodedUri = encodeURI('data:text/json;charset=utf-8,' + jsonContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link) // Required for FF
  link.click()
}

// improved download function
function downloadData(content, filename, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type })
  // IE11 & Edge
  if (navigator.msSaveBlob) {
    // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
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

// call only after X ms has passed
// Sample Usage
// searchIdDom.addEventListener('input', debounce(makeApiFetch, 1000))
// Application - Debouncing an input type event handler. (like our search input example), a scroll event handler.
const debounce = (fn, delay) => {
  let timeout = null
  return (...args) => {
    const next = () => fn(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, delay)
  }
}

// call only X times in Y ms
// Sample Usage
// const myHandler = (event) => {...do some stuf...}
// myMouseDomElement.addEventListener("mousemove", throttle(myHandler, 1000));
// Application - Throttling an API call, button click so we can’t spam click, touch/move mouse event handler.
function throttle(fn, wait) {
  let time = Date.now()
  return function () {
    if (time + wait - Date.now() < 0) {
      fn()
      time = Date.now()
    }
  }
}

function isEmail(email) {
  // return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email)
  return /[\w\d-]+@[\w\d-]+\.[\w\d-]+/.test(email)
}

// universal end-of-line splitter
// .split(/\r?\n/)

const obj2Qs = (obj) =>
  Object.keys(obj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&')

const utf8toBase64 = (str) => Buffer.from(str, 'utf8').toString('base64')
const base64toUtf8 = (str) => Buffer.from(str, 'base64').toString('utf8')

const foo = Math.PI + Math.SQRT2

export { foo, makeCsvRow, exportCsv, exportJson, downloadData, debounce, throttle, isEmail, obj2Qs }
