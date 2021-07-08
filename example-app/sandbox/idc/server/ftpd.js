'use strict'
require('dotenv').config()

const express    = require('express')
const serveIndex = require('serve-index')

const app = express()

// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/logs', express.static('logs'), serveIndex('logs', {'icons': true}))

// Listen
app.listen(3000)
