## Notes

1. Do not add to req

Do not add to req because you do not have access to req in websocket

2. Do not add to app?

app cannot be used globally and should not be exported by the main index.js


## Database Schema

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


* POST /auth/signup
* POST /auth/login
* GET /auth/logout
* POST /auth/otp

POST /api/authors
PATCH /api/authors/:id
GET /api/authors/:id
GET /api/authors

POST /api/categories
PATCH /api/categories/:id
GET /api/categories/:id
GET /api/categories

POST /api/books
PATCH /api/books/:id
GET /api/books/:id
GET /api/books

POST /books/:id/pages - add page to book
DELETE /pages/:id
PATCH /pages/:id

POST /books/:id/authors/:authorId - relate author to book
DELETE /books/:id/authors/:authorId - unrelate author to book

GET /api/test
POST /api/upload
POST /api/uploads

