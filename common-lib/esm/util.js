const APP_VERSION = '0.3.6'

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

// Usage debounce(<Your Function>, <debounce time in milliseconds>)
// const debounce = (func, delayMs) => { 
//   let debounceTimer 
//   return function() { 
//     const context = this
//     const args = arguments 
//     clearTimeout(debounceTimer) 
//     debounceTimer = setTimeout(() => func.apply(context, args), delayMs) 
//   } 
// }

// call only after X ms has passed
// Usage debounce(<Your Function>, <debounce time in milliseconds>)
// searchIdDom.addEventListener('input', () => { debounce(makeApiFetch(), 1000); }
// Application
// - Debouncing an input type event handler. (like our search input example)
// - Debouncing a scroll event handler.
const debounce = (callback, delay) => {
  let timeout = null
  return (...args) => {
    const next = () => 
    callback(...args);
    clearTimeout(timeout);
    timeout = setTimeout(next, delay)
  }
}

// call only X times in Y ms
// Usage throttle(<Your Function>, <debounce time in milliseconds>)
// const myHandler = (event) => {...do some stuf...}
// const myThrottleHandler = throttle(myHandler, 1000);
// myMouseDomElement.addEventListener("mousemove", myThrottleHandler);
// Application
// - Throttling an API call.
// - Throttling a button click so we can’t spam click.
// - Throttling a touch/move mouse event handler.
function throttle(callback, wait) {
  var time = Date.now();
  return function() {
   if ((time + wait - Date.now()) < 0) {
     callback();
     time = Date.now();
   }
  }
 }

export { APP_VERSION, makeCsvRow, exportCsv, exportJson, downloadData, debounce, throttle }
