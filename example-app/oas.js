const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./openapi/example.yaml')
// const swaggerDocument = require('./swagger.json')

const options = { explorer: true }

app.use('/openapi', express.static('openapi'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
app.get('*', (req, res) => res.send('use /api-docs!'))
app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`))

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
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));