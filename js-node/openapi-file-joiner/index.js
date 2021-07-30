#!/usr/bin/env node
'use strict'
const resolve = require('json-refs').resolveRefs
const YAML = require('js-yaml')
const fs = require('fs')
require('dotenv').config()


process.chdir(process.env.OPENAPI_FOLDER)
// console.log(process.cwd())

const file = process.env.OPENAPI_BASEFILE
const root = YAML.load(fs.readFileSync(file).toString())
const options = {
  filter        : ['relative', 'remote'],
  loaderOptions : {
    processContent : function (res, callback) {
      callback(null, YAML.load(res.text));
    }
  }
}
resolve(root, options).then(function (results) {
  const yamlStr = YAML.dump(results.resolved) // yaml
  // console.log(JSON.stringify(results.resolved, null, 2)) // json
  fs.writeFileSync(process.env.OUTPUT_FILE, yamlStr)
})
