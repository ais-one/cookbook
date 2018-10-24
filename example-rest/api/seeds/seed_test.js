
exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries
  await knex('authors_books').del()
  await knex('pages').del()
  await knex('authors').del()
  await knex('books').del()
  
  await knex('authors').insert([
    {id: 1, name: 'author1'},
    {id: 2, name: 'author2'},
    {id: 3, name: 'author3'}
  ])
  await knex('books').insert([
    {id: 1, name: 'book1', category: 'fiction'},
    {id: 2, name: 'book2', category: 'fiction'},
    {id: 3, name: 'book3', category: 'non-fiction'},
    {id: 4, name: 'book1_2', category: 'fiction'},
    {id: 5, name: 'book2a', category: 'non-fiction'}
  ])
  await knex('authors_books').insert([
    {authorId: 1, bookId: 1},
    {authorId: 2, bookId: 2},
    {authorId: 3, bookId: 3},
    {authorId: 1, bookId: 4},
    {authorId: 2, bookId: 4},
    {authorId: 2, bookId: 5}
  ])
  await knex('pages').insert([
    {id: 1, content: 'Book 1 Page 1', bookId: 1},
    {id: 2, content: 'Book 1 Page 2', bookId: 1},
    {id: 3, content: 'Book 1 Page 3', bookId: 1},
    {id: 4, content: 'Book 2 Page 1', bookId: 2},
    {id: 5, content: 'Book 3 Page 1', bookId: 3},
    {id: 6, content: 'Book 1_2 Page 1', bookId: 4},
    {id: 7, content: 'Book 1_2 Page 2', bookId: 4},
    {id: 8, content: 'Book 2a Page 1', bookId: 5}
  ])

  return Promise.resolve()
};
