// import 'date-fns'

exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries
  await knex('books_authors').del()
  await knex('pages').del()
  await knex('books').del()
  await knex('authors').del()
  await knex('categories').del()

  var dt = new Date()

  await knex('authors').insert([
    {id: 1, name: 'author1', created_at: dt.setDate( dt.getDate() - 2 ) },
    {id: 2, name: 'author2', created_at: dt.setDate( dt.getDate() - 1 ) },
    {id: 3, name: 'author3', created_at: new Date() }
  ])
  await knex('categories').insert([
    {id: 1, name: 'cat1'},
    {id: 2, name: 'cat2'}
  ])

  dt = new Date()
  await knex('books').insert([
    {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: dt.setDate( dt.getDate() - 4 ) },
    {id: 2, name: 'book2', categoryId: 2, rating: 4, yearPublished: '2003', created_at: dt.setDate( dt.getDate() - 3 ) },
    {id: 3, name: 'book3', categoryId: 1, rating: 3, yearPublished: '2010', created_at: dt.setDate( dt.getDate() - 2 ) },
    {id: 4, name: 'book4', categoryId: 1, rating: 2, yearPublished: '2009', created_at: dt.setDate( dt.getDate() - 1 ) },
    {id: 5, name: 'book5', categoryId: 2, rating: 1, yearPublished: '2007', created_at: dt }
  ])
  await knex('books_authors').insert([
    {authorId: 1, bookId: 1},
    {authorId: 2, bookId: 2},
    {authorId: 3, bookId: 3},
    {authorId: 1, bookId: 4},
    {authorId: 2, bookId: 4},
    {authorId: 2, bookId: 5}
  ])
  await knex('pages').insert([
    {id: 1, content: 'page1', bookId: 1},
    {id: 2, content: 'page2', bookId: 1},
    {id: 3, content: 'page3', bookId: 1},
    {id: 4, content: 'page4', bookId: 2},
    {id: 5, content: 'page5', bookId: 3},
    {id: 6, content: 'page6', bookId: 4},
    {id: 7, content: 'page7', bookId: 4},
    {id: 8, content: 'page8', bookId: 5}
  ])

  return Promise.resolve()
};
