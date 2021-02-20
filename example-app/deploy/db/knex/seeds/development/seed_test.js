const mkDt = () => (new Date()).toISOString()

new Intl.DateTimeFormat('default', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: false, formatMatcher: 'basic'
}).format(new Date())

exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('books_authors').del()
  await knex('pages').del()
  await knex('books').del()
  await knex('authors').del()
  await knex('categories').del()

  await knex('person').del()
  await knex('country').del()
  await knex('state').del()
  await knex('grade').del()

  await knex('authors').insert([
    {id: 1, name: 'author1', avatar: '', created_at: mkDt() },
    {id: 2, name: 'author2', avatar: '', created_at: mkDt() },
    {id: 3, name: 'author3', avatar: '', created_at: mkDt() },
    {id: 4, name: 'author4', avatar: '', created_at: mkDt() },
    {id: 5, name: 'author5', avatar: '', created_at: mkDt() }
  ])
  await knex('categories').insert([
    {id: 1, name: 'cat1', created_at: mkDt() },
    {id: 2, name: 'cat2', created_at: mkDt() },
    {id: 3, name: 'cat3', created_at: mkDt() }
  ])

  await knex('books').insert([
    {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: mkDt() },
    {id: 2, name: 'book2', categoryId: 2, rating: 4, yearPublished: '2003', created_at: mkDt() },
    {id: 3, name: 'book3', categoryId: 1, rating: 3, yearPublished: '2010', created_at: mkDt() },
    {id: 4, name: 'book4', categoryId: 1, rating: 2, yearPublished: '2009', created_at: mkDt() },
    {id: 5, name: 'book5', categoryId: 2, rating: 1, yearPublished: '2007', created_at: mkDt() }
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
    {id: 1, content: 'page1', bookId: 1, created_at: mkDt()},
    {id: 2, content: 'page2', bookId: 1, created_at: mkDt()},
    {id: 3, content: 'page3', bookId: 1, created_at: mkDt()},
    {id: 4, content: 'page4', bookId: 2, created_at: mkDt()},
    {id: 5, content: 'page5', bookId: 3, created_at: mkDt()},
    {id: 6, content: 'page6', bookId: 4, created_at: mkDt()},
    {id: 7, content: 'page7', bookId: 4, created_at: mkDt()},
    {id: 8, content: 'page8', bookId: 5, created_at: mkDt()}
  ])

  await knex('country').insert( require('../../../icc.json') )
  await knex('state').insert( require('../../../state.json') )
  await knex('person').insert( [
    {
      firstName: 'first',
      lastName: 'last',
      sex: 'M',
      subjects: 'EM,PHY',
      age: 1,
      gpa: 0,
      birthDate: '',
      birthTime: '',
      country: 'SG',
      birthDateTimeTz: null,
      website: '',
      remarks: '',
      updated_by: 'someone',
      updated_at: new Date()  
    }
  ] )
  await knex('grade').insert( [ // personId from insert above...
    { personId: 1, subject: 'EM', grade: '80' },
    { personId: 1, subject: 'AM', grade: '90' },
    { personId: 1, subject: 'PHY', grade: '70' }
  ] )
}
