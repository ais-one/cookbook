## Project Strcuture

https://softwareengineering.stackexchange.com/questions/338597/folder-by-type-or-folder-by-feature
https://kentcdodds.com/blog/how-i-structure-express-apps

```
+- app-sample-template : custom apps are here in this folder
|  +- app-sample-template/ : sample custom application (prefixed with app-)
|  |  +- controllers/
|  |  +- deploy/ : deployment folder (see README.md within the deploy folder)
|  |  +- models/
|  |  +- openapi/ : OpenAPI yaml files
|  |  +- routes/ : application REST API & websocket setup
|  |  +- tables/ : configurable table & crud
|  |  +- tests/ : Jest tests for custom application
|  |  +- graphql-schema.js : application GraphQL schemas and resolvers
+- logs/
+- middlewares/ : common middlewares
+- public/ : for serving static files - website
|  +- demo-express/ (127.0.0.1/)
+- router/ : common route / controller & services
+- sandbox/ : Useful scripts
+- tests/ : Jest tests for expressjs
+- uploads/ : for file uploads
+- .dockerignore
+- .eslintrc.js
+- .gitignore
+- app.js : the express app boilerplate
+- deploy.sh: GCP deployment script
+- docker-compose.yml
+- Dockerfile
+- ecosystem.config.js
+- index.js
+- jest.config.js: JEST testing
+- package.json
+- README.md
+- test.http : rest API commands testing VSCode plugin (Rest Client - humao.rest-client)
+- test-playground.mongodb : mongoDB client VSCode plugin (MongoDB for VS Code - mongodb.mongodb-vscode)
+- test.py: run python from express
```

## If You Want To Use DTOs

https://stackoverflow.com/questions/62504764/entities-dtos-in-javascript

- Use AJV
- ORM with Modeling

## Relational Database Schema

### Simple Relation
 * books <- 1 --- 1 -> categories - one book belongs to one category
 * books <- M --- N -> authors - one book has many authors, and an author can have more than 1 book
 * books <- 1 --- M -> pages - one book has many pages

### Simple Table Schema
 * authors - id, name
 1, author1
 2, author2

 * categories - id, name
 1, cat1
 2, cat2

 * books - id, name, categoryId
 1, book1, 1
 2, book2, 1

 * pages - id, name, bookId
 1, pageA, 1
 2, pageB, 1
 3, pageC, 2
 4, pageD, 2
 5, pageE, 2

 * book_author - bookId, authorId
 1, 1
 1, 2
 2, 1
 2, 2


### CRUD Routes
[* === COMPLETED, ** === TESTED]
* POST /auth/signup
* POST /auth/login
* GET /auth/logout
* POST /auth/otp

* POST /api/authors
* PATCH /api/authors/:id
* GET /api/authors/:id
* GET /api/authors

* POST /api/categories
* PATCH /api/categories/:id
* GET /api/categories/:id
* GET /api/categories

* POST /api/books
* PATCH /api/books/:id
* GET /api/books/:id
* GET /api/books

* POST /books/:id/pages - add page to book
* DELETE /pages/:id - remove page from book
* PATCH /pages/:id - edit a page

* POST /books/:id/authors/:authorId - relate author to book
* DELETE /books/:id/authors/:authorId - unrelate author to book


