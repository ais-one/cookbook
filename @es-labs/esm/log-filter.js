//NOSONAR const type = 'error'
// const orig = console[type]
// console[type] = function logError() {
//   orig.apply(console, [`[${new Date().toISOString().replace("T", " ").replace(/\..+/, "")}]`, ...arguments])
// }
const LogFilter = (function () {
  return function (list) {
    if (list && list.length) {
      list.forEach(item => {
        console[item] = function () { }
      })
    }
  }
})()
