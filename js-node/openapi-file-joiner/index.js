#!/usr/bin/env node
'use strict'
const resolve = require('json-refs').resolveRefs
const YAML = require('js-yaml')
const fs = require('fs')

const cfgJson = require('./cfg.json')
const config = cfgJson[cfgJson.mode]

process.chdir(config.OPENAPI_FOLDER)
// console.log(process.cwd())

const file = config.OPENAPI_BASEFILE
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
  //NOSONAR console.log(JSON.stringify(results.resolved, null, 2)) // json
  fs.writeFileSync(config.OUTPUT_FILE, yamlStr)
})
