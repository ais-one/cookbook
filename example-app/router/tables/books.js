module.exports = {
  db: 'knex', // knex / mongodb
  name: 'books', // table name
  cols: {
    id: { // primary key column, _id for mongodb
      label: 'ID',
      auto: 'pk'
    },
    name: {
      label: 'Name',
      multiKey: true,

      type: 'string', // Number (Integer, Decimal), Boolean, Date (datetime, date, time)

      formEditor: '',

      filterEditor: '', // date, number, string, date, datetime, time, select, multi-select, dropdown, lookup
      filterOp: '=', // '=,!=,like,>=,<=,>,<,><,=><=,><=,><='

      transform: ''
    },
    categoryId: {
      label: 'Category', // key value...
      type: 'single' // single select
      // related
    },
    rating: {
      label: 'Rating',
      type: 'integer'
    },
    yearPublished: {
      label: 'Year Published',
      type: 'string'
    },
    created_at: {
      label: 'Created At',
      auto: 'ts'
    }
  },
  // generated values
  pk: '', // eight pk or multikey
  multiKey: [],
  auto: [],
  nonAuto: []
  // {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: mkDt() },
}