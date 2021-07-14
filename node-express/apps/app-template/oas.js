/*
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')

app.use('/openapi', express.static('openapi'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./openapi/example.yaml'), { explorer: true }))
app.get('*', (req, res) => res.send('use /api-docs!'))
app.listen(8080, () => console.log(`Example app listening at http://localhost:8080`))

// if serving multiple documents
// const swaggerDocumentOne = require('./swagger-one.json');
// const swaggerDocumentTwo = require('./swagger-one.json');
// app.use('/api-docs-one', swaggerUi.serveFiles(swaggerDocumentOne, options), swaggerUi.setup(swaggerDocumentOne));
// app.use('/api-docs-two', swaggerUi.serveFiles(swaggerDocumentTwo, options), swaggerUi.setup(swaggerDocumentTwo));

// load from multiple URLs
// var options = {
//   explorer: true,
//   swaggerOptions: {
//     urls: [
//       { url: 'http://petstore.swagger.io/v2/swagger.json', name: 'Spec1' },
//       { url: 'http://petstore.swagger.io/v2/swagger.json', name: 'Spec2' }
//     ]
//   }
// }
*/


const path = require('path');
const yamljs = require('yamljs');
const { resolveRefs } = require('json-refs');

/**
 * Return JSON with resolved references
 * @param {array | object} root - The structure to find JSON References within (Swagger spec)
 * @returns {Promise.<JSON>}
 */
const multiFileSwagger = (root) => {
  const options = {
    filter: ["relative", "remote"],
    loaderOptions: {
      processContent: function (res, callback) {
        callback(null, yamljs.parse(res.text));
      },
    },
  };

  return resolveRefs(root, options).then(
    function (results) {
      return results.resolved;
    },
    function (err) {
      console.log(err.stack);
    }
  );
};


multiFileSwagger(
  yamljs.load(path.resolve(__dirname, "./openapi/example.yaml"))
).then(res => console.log(res))