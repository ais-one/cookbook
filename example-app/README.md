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

# Project Strcuture

```
+- common-express/ : common setup
+- config/ : centralized config folder (see README.md within the config folder)
+- controllers/
+- deploy/ : deployment folder (see README.md within the deploy folder)
|  +- db/ : for seeding and migrating data
|     +- knex/
|     |  +- migrations/
|     |  +- seeds/
|     +- mongo/
+- graphql/ : graphql stuff
+- jobs/ : message queue jobs
+- logs/
+- middlewares/
+- models/
+- public/ : for serving static files - website
|  +- demo-express/ (127.0.0.1/)
+- router/
+- sandbox/ : Useful scripts
+- tests/ : Jest tests
+- uploads/ : for serving static files - files
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
+- process-cron.js: sample cron triggered process
+- process-long.js: sample long running process
+- README.md
+- test.py: run python from express

```