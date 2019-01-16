## Notes

1. Do not add to req

Do not add to req because you do not have access to req in websocket

1. Do not add to app?

app cannot be used globally and should not be exported by the main index.js


## Database Schema

categories - customers
authors - items
pages - ?
books - orders

books <- 1 --- 1 -> categories
books <- M --- N -> authors
books <- 1 --- M -> pages

orders <- 1 --- 1 -> customers
orders <- M --- N -> items
orders <- 1 --- M -> ?
