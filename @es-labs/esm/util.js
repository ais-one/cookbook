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
    // link.setAttribute('href', 'data;text/csv;charset=utf-8,' + encodeURIComponent(SOME_CSV_DATA)) // previous way of doing
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

// https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
const emptyObject = value => value && Object.keys(value).length === 0 && value.constructor === Object // check if object is empty, also false if not object

function isEmail(email) {
  // return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email)
  return /[\w\d-]+@[\w\d-]+\.[\w\d-]+/.test(email)
}

// universal end-of-line splitter
// .split(/\r?\n/)

// https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
function jsonToCsv (items) {
  const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
  const header = Object.keys(items[0])
  return [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
}

const objectToQueryString = (obj) =>
  Object.keys(obj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&')

const rebaseString = (str, from, to) => Buffer.from(str, from).toString(to) // base64, utf8

// NOSONAR
// Description: traverse a JSON object and transform the nodes. object will be mutated
//
// Usage:
// let testObj = [
//   1, 2, [3, { 'a': 5, 'b': [6, 7, { 'c': 8}] }], { 'd': 9}
// ]
// const testFn = (x) => typeof x === 'number' ? x * 2 : x
// traverseJson(testObj, testFn)
// console.log(testObj)
//
const traverseJson = (json, fn, parent = null, key = null) => {
  if (typeof json === 'object') {
    if (Array.isArray(json)) {
      json.forEach((item, index) => traverseJson(item, fn, json, index))
    } else if (json.constructor === Object) {
      for (const k in json) traverseJson(json[k], fn, json, k)
    }
  } else {
    if (typeof parent === 'object' && key !== null) parent[key] = fn(json)
  }
}

export { debounce, downloadData, emptyObject, isEmail, jsonToCsv, objectToQueryString, rebaseString, throttle, traverseJson }
