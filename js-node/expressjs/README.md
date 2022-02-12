## Project Strcuture

https://softwareengineering.stackexchange.com/questions/338597/folder-by-type-or-folder-by-feature
https://kentcdodds.com/blog/how-i-structure-express-apps

```
+- apps : custom apps are here in this folder
|  +- app-template/ : sample custom application (prefixed with app-)
|  |  +- config/ : application configs (see README.md within the config folder)
|  |  +- controllers/
|  |  +- deploy/ : deployment folder (see README.md within the deploy folder)
|  |  |  +- db/ : for seeding and migrating data
|  |  |  |  +- knex/
|  |  |  |  |  +- migrations/
|  |  |  |  |  +- seeds/
|  |  |  |  +- mongo/
|  |  +- jobs/ : message queue jobs
|  |  +- models/
|  |  +- openapi/ : OpenAPI yaml files
|  |  +- routes/ : application REST API & websocket setup
|  |  +- services/ : services used
|  |  +- tables/ : configurable table & crud
|  |  +- tests/ : Jest tests for custom application
|  |  +- uploads/ : for file uploads
|  |  +- graphql-schema.js : application GraphQL schemas and resolvers
|  +- app-custom/ : your custom app, put under source control (app-* is git ignored)
+- common/ : common express setup
+- logs/
+- middlewares/
+- public/ : for serving static files - website
|  +- demo-express/ (127.0.0.1/)
+- router/
+- sandbox/ : Useful scripts
+- tests/ : Jest tests for expressjs
+- .dockerignore
+- .eslintrc.js
+- .gitignore
+- app.js : the express app boilerplate
+- deploy-vm.sh: VM deployment script
+- deploy.sh: GCP deployment script
+- docker-compose.yml
+- Dockerfile
+- ecosystem.config.js
+- index.js
+- jest.config.js: JEST testing
+- knexfile.js: Knex query builder
+- package.json
+- README.md
+- test.py: run python from express
+- test-playground.mongodb : mongoDB client VSCode plugin (MongoDB for VS Code - mongodb.mongodb-vscode)
+- test-rest-cmd.http : rest API commands testing VSCode plugin (Rest Client - humao.rest-client)

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


