exports.up = async (knex) => {
  await knex.schema
    .createTable('categories', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
      table.timestamps(true, true)
    })
    await knex.schema
    .createTable('books', (table) => {
      table.increments('id').primary()
      table.string('name').unique()
      table.integer('rating')
      table.string('yearPublished')
      table.integer('categoryId').references('categories.id')
      table.timestamps(true, true)
    })
    await knex.schema
    .createTable('pages', (table) => { // one book, many pages
      table.increments('id').primary()
      table.string('content')
      table.integer('bookId').references('books.id')
      table.timestamps(true, true)
    })
    await knex.schema
    .createTable('authors', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('avatar').defaultsTo('')
      table.timestamps(true, true)
    })
    await knex.schema
    .createTable('books_authors', (table) => { // many books, many authors
      table.integer('bookId').unsigned().references('books.id')
      table.integer('authorId').unsigned().references('authors.id')
      table.unique(['bookId', 'authorId']) // remove this and you will have duplicates
    })

    await knex.schema.createTable('country', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('code')
      table.string('icc')
      table.unique('code')
      table.unique('name')
    })
    await knex.schema.createTable('state', (table) => {
      table.increments('id').primary()
      table.string('country_name')
      table.string('code')
      table.string('name')
      table.unique(['country_name', 'code'])
    })
    await knex.schema.createTable('person', (table) => {
      table.string('firstName')
      table.string('lastName')
      table.string('sex')
      table.string('subjects')
      table.integer('age')
      table.decimal('gpa')
      table.date('birthDate')
      table.time('birthTime')
      table.string('country')
      table.datetime('birthDateTimeTz')
      table.string('website')
      table.string('remarks')
      table.string('updated_by')
      table.datetime('updated_at')      
      table.unique(['firstName', 'lastName'])
    })
    await knex.schema.createTable('grade', (table) => {
      table.increments('id').primary()
      table.string('personId')
      table.string('subject')
      table.string('grade')
      table.index('personId')
    })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('book_authors')
  await knex.schema.dropTableIfExists('pages')
  await knex.schema.dropTableIfExists('books')
  await knex.schema.dropTableIfExists('authors')
  await knex.schema.dropTableIfExists('categories')

  await knex.schema.dropTableIfExists('country')
  await knex.schema.dropTableIfExists('state')
  await knex.schema.dropTableIfExists('person')
  await knex.schema.dropTableIfExists('grade')
}
