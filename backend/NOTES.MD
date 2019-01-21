## Notes

1. Do not add to req

Do not add to req because you do not have access to req in websocket

1. Do not add to app?

app cannot be used globally and should not be exported by the main index.js


## Database Schema

### Simple Relation
 * books <- 1 --- 1 -> categories - one book belongs to one category
 * books <- M --- N -> authors - one book has many authors, and an author can have more than 1 book
 * books <- 1 --- M -> pages - one book has many pages

### Simple Table Schema
 * authors - id, name
 * categories - id, name
 * books - id, name, categoryId
 * pages - id, name, bookId
 * book_author - bookId, authorId

categories - customers
authors - items
pages - orderline
books - orders

customers - id, name, address, contact
items - id, name, sku, price
orders - id, date, customerId, totalPrice
lines - id, orderId, quantity, price, tax, totalAmount (WIP)
line_item - lineId, itemId

orders <- 1 --- 1 -> customers
orders <- M --- N -> items
orders <- 1 --- M -> ?
