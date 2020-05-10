let APPNAME
if (!APPNAME) {
  try {
    APPNAME = process.argv.find(arg => arg.indexOf('app') !== -1).split('=')[1]
  } catch (e) {
    // APPNAME = 'example-app'
    // console.log(e.toString())
    console.log('Usage: npm run dev -- app=[app folder name]')
    process.exit(0)
  }
}

module.exports = APPNAME // process.argv[2] || 'example-app'
