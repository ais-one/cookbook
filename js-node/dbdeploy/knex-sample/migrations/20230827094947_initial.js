/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('groups')
    table.integer('orgId')
    table.string('username')
    table.string('email').unique('email')
    table.integer('githubId').unique('githubId').nullable()
    table.string('password') // hashed
    table.string('role')

    // retry limit
    table.integer('retryLimit', 3)
    table.integer('retryCount', 0)
    table.integer('retryReset', 30) // number of seconds before user can retry

    // authenticators
    table.string('gaKey', 32).comment('Google Authenticator Key')

    // push notification
    table.string('pnToken').defaultTo('')

    table.string('revoked').defaultTo('')
    table.string('refreshToken').defaultTo('')

    // SMS number
    table.string('sms')
    table.dateTime('smsLastSent')
    table.string('smsOtpPin', 6)
    table.integer('smsVerified') // need to verify sms

    // telegram
    table.string('telegramId')
    table.string('telegramUsername')
    // table.timestamps() // createdAt, updatedAt
  })
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('book_authors')
  await knex.schema.dropTableIfExists('pages')
  await knex.schema.dropTableIfExists('books')
  await knex.schema.dropTableIfExists('authors')
  await knex.schema.dropTableIfExists('categories')
  await knex.schema.dropTableIfExists('country')
  await knex.schema.dropTableIfExists('state')
  await knex.schema.dropTableIfExists('person')
  await knex.schema.dropTableIfExists('grade')
  await knex.schema.dropTableIfExists('users')
}
