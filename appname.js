let APPNAME
// if (!APPNAME) {
//   try {
//     APPNAME = process.argv.find(arg => arg.indexOf('app') !== -1).split('=')[1]
//   } catch (e) {
//     // APPNAME = 'example-app'
//     // console.log(e.toString())
//     console.log('Usage: npm run dev -- app=[app folder name]')
//     process.exit(0)
//   }
// }

console.log('xxx', process.argv) // TBD JEST RUNNER ARGUMENTS is different already... 
// So, how to get the APPNAME?
// xxx [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\user\\test\\vue-crud-x\\node_modules\\jest-worker\\build\\workers\\processChild.js'
// ]

try {
  APPNAME = process.argv[2] || 'example-app'
} catch (e) {
  console.log('Usage: npm run dev -- [app folder name]')
  process.exit(0)
}

module.exports = APPNAME
