
exports.up = async (knex, Promise) => {
  await knex.schema.createTable('books', function(table) {
    table.increments('id').primary()
    table.string('name')
    table.string('category')
  }).createTable('pages', function(table) { // one book, many pages
    table.increments('id').primary()
    table.string('content')
    table.integer('bookId').references('books.id')
    // table.integer('ownerId').unsigned().references('id').inTable('persons').onDelete('SET NULL');
  }).createTable('authors', function(table) {
    table.increments('id').primary()
    table.string('name')
  }).createTable('authors_books', function(table) { // many books, many authors
    // table.increments('id').primary()
    table.integer('authorId').unsigned().references('authors.id')
    // table.integer('authorId').unsigned().references('id').inTable('authors').onDelete('CASCADE')
    table.integer('bookId').unsigned().references('books.id')
    // table.integer('bookId').unsigned().references('id').inTable('books').onDelete('CASCADE')
  })
  return Promise.resolve()
}

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('authors_books')
    .dropTableIfExists('pages')
    .dropTableIfExists('authors')
    .dropTableIfExists('books')
  return Promise.resolve()
}


/* bookshelf
var Book = bookshelf.Model.extend({
  tableName: 'books',
  authors: function() {
    return this.belongsToMany(Author);
  },
  pages: function() {
    return this.hasMany(Page);
  }
});

var Page = bookshelf.Model.extend({
  tableName: 'pages',
  book: function() {
    return this.belongsTo(Book);
  }
});

var Author = bookshelf.Model.extend({
  tableName: 'authors',
  books: function() {
    return this.belongsToMany(Book);
  }
});
*/