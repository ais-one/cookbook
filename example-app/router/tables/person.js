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
    },
    sex: { // single select
      label: 'Sex',
      type: 'select',
      options: [
        { key: '', text: '' },
        { key: 'M', text: 'Male' },
        { key: 'F', text: 'Female' }
      ]
    },
    subjects: { // multi select
      label: 'Subjects',
      type: 'multi-select',
      options: [
        { key: 'EL1', text: 'English' },
        { key: 'EM', text: 'E Maths' },
        { key: 'AM', text: 'A Maths' },
        { key: 'PHY', text: 'Chemistry' },
        { key: 'CHEM', text: 'Physics' }
      ]
    },
    age: { // integer
      label: 'Age',
      type: 'number',
    },
    gpa: { // decimal
      label: 'GPA',
      type: 'decimal',
      required: true
    },
    birthDate: { // date of birth - YYYY-MM-dd (no timezone - assume local - store as string)
      label: 'Brith date',
      type: 'string' // date
    },
    birthTime: { // HHmm (no timezone - assume local - store as string)
      label: 'Birth time',
      type: 'string' // time
    },
    country: {
      label: 'Country', // key text...
      type: 'autocomplete', // single select, no custom values
      options: {
        tableName: 'country',
        limit:8,
        key: 'name',
        text: ''
      }
    },
    birthDateTimeTz: { // date with time info
      label: 'Datetime with TZ',
      type: 'datetime'
    },
    website: {
      label: 'Age',
      type: 'string'
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