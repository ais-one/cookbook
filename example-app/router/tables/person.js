module.exports = {
  db: 'knex', // knex / mongodb
  name: 'person', // table name
  cols: {
    firstName: {
      label: 'First Name',
      multiKey: true,
      type: 'string', // Number (Integer, Decimal), Boolean, Date (datetime, date, time)
      formEditor: '',
      // '=,!=,like,>=,<=,>,<' - compare operator
      // AND, OR - boolean operator
    },
    lastName: {
      label: 'Last Name',
      multiKey: true,
      type: 'string', // Number (Integer, Decimal), Boolean, Date (datetime, date, time)
      formEditor: '',
      // '=,!=,like,>=,<=,>,<' - compare operator
      // AND, OR - boolean operator
    },
    country: {
      label: 'Country', // key value...
      type: 'autocomplete' // single select
      // related
    },
    age: {
      label: 'Age',
      type: 'integer',
      required: true
    },
    dateOfBirth: {
      label: 'Date Of Birth',
      type: 'date'
    },
    timeOfBirth: {
      label: 'Time Of Birth',
      type: 'time'
    },
    updated_by: { label: 'Updated By', auto: 'user' },
    updated_at: { label: 'Updated At', auto: 'ts' }
  },
  // generated values
  pk: '', // either pk or multikey
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
  // {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: mkDt() },
}