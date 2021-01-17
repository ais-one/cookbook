module.exports = {
  db: 'mongo', // knex / mongodb
  name: 'person', // table name
  create: true, // able to add record,
  update: true, // able to update
  delete: true, // able to delete record(s)
  import: true, // can import from csv
  export: true, // can export to csv
  multiSelect: true, // multiple selection
  cols: {
    _id: { // primary key column, _id for mongodb (can cause error in mongodb)
      label: 'ID',
      auto: 'pk', // should override multiKey
      hide: true, // default is show column
      filter: false, // default is exclude from filter
      sort: false, // default is exclude from sort
      add: 'hide',
      input: 'link',
      options: { from: 'table-person', to: 'table-grade-slot', relatedCol: 'personId' }, // router link
      edit: 'readonly'
    },
    firstName: {
      label: 'First Name',
      multiKey: true, // part of composite unique key - required!

      filter: true, // truthy means hide column on filter,
      add: '', // 'hide', '' - empty string means can show and edit
      edit: '', // 'hide', 'readonly', '' - empty string means can show and edit
      default: '', // a default value (today? now?)

      type: 'string', // string, integer, decimal, datetime, date, time, boolean (follows the DB datatype)
      // OLD
      input: 'textfield', // textfield, textarea, number, date, time, datetime, upload, autocomplete, select, multi-select, link - to child table
      // NEW
      ui: {
        tag: 'input',
        attrs: { pattern: '^[A-Za-z]+$', min: 2, maxlength: 20 } // pattern, min, max, step
      },

      rules: {
        min: 2,
        regex: '^[A-Za-z]+$' // {10} // must be 10
      }
    },
    lastName: {
      label: 'Last Name',
      multiKey: true,
      type: 'string',
      filter: true,

      // OLD
      input: 'textfield',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'text', min: 0, max: 20 }
      },

      rules: {
        min: 0, max: 20
      },
      width: 250
    },
    sex: { // single select
      label: 'Sex',
      type: 'string',
      filter: true,
      // OLD
      input: 'select',
      options: [
        { key: '', text: '' },
        { key: 'M', text: 'Male' },
        { key: 'F', text: 'Female' }
      ],
      // NEW
      ui: {
        tag: 'input',
        // input: 'select',
        // options: [
        //   { key: '', text: '' },
        //   { key: 'M', text: 'Male' },
        //   { key: 'F', text: 'Female' }
        // ]  
      }
    },
    subjects: { // multi select
      label: 'Subjects',
      type: 'string',
      // OLD
      input: 'multi-select',
      options: [
        { key: 'EL1', text: 'English' },
        { key: 'EM', text: 'E Maths' },
        { key: 'AM', text: 'A Maths' },
        { key: 'PHY', text: 'Chemistry' },
        { key: 'CHEM', text: 'Physics' }
      ],
      // NEW
      ui: {
        tag: 'input',
        // input: 'multi-select',
        // options: [
        //   { key: 'EL1', text: 'English' },
        //   { key: 'EM', text: 'E Maths' },
        //   { key: 'AM', text: 'A Maths' },
        //   { key: 'PHY', text: 'Chemistry' },
        //   { key: 'CHEM', text: 'Physics' }
        // ]
      }
    },
    age: { // integer
      label: 'Age',
      type: 'integer',
      filter: true,

      // OLD
      input: 'number',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'number', min: 10, max: 90, step: 1 }
      },

      validation: {
        min: 10, max: 90
      }
    },
    gpa: { // decimal
      label: 'GPA',
      type: 'decimal',
      filter: true,
      // OLD
      input: 'number',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'number' }
      },
      required: true
    },
    birthDate: { // date of birth - YYYY-MM-dd (no timezone - assume local - store as string)
      label: 'Brith date',
      type: 'string', // date
      filter: true,
      // OLD
      input: 'date',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'date' }
      },
    },
    birthTime: { // HHmm (no timezone - assume local - store as string)
      label: 'Birth time',
      type: 'string', // time
      filter: true,
      // OLD
      input: 'time',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'time' }
      }
    },
    birthDateTimeTz: { // date with time info
      label: 'Datetime with TZ',
      type: 'datetime',
      filter: true,
      // OLD
      input: 'datetime',
      // NEW
      ui: {
        tag: 'input',
        attrs: { type: 'datetime-local' }
      }
    },
    country: {
      label: 'Country', // key text...
      type: 'string',
      filter: true,
      // OLD
      input: 'autocomplete', // single select
      options: {
        parentCol: '', // use column to get parent value affecting a child
        parentTableColName: '', // the column name in the parent table
        childCol: 'state', // affect child column in this table
        dbName: 'mongo',
        tableName: 'country',
        limit:8,
        strict: true, // cannot enter own values, must be selected
        key: 'name',
        text: ''
      },
      // NEW
      ui: {
        tag: 'input'
      }
    },
    state: {
      label: 'State', // key text...
      type: 'string',
      filter: true,
      // OLD
      input: 'autocomplete',
      options: {
        parentCol: 'country',
        parentTableColName: 'country_name',
        childCol: '',
        dbName: 'mongo',
        tableName: 'state',
        limit:8,
        key: 'name',
        text: ''
      },
      // NEW
      ui: {
        tag: 'input'
      }
    },
    website: { // test formatter?
      label: 'URL',
      type: 'string',
      // OLD
      input: 'textfield',
      // NEW
      ui: {
        tag: 'input'
      }
    },
    remarks: { // text area
      label: 'Remarks',
      type: 'string',
      // OLD
      input: 'textarea',
      // NEW
      ui: {
        tag: 'input' // textarea
      }
    },
    updated_by: {
      label: 'Updated By',
      auto: 'user', // autogenerated field... user = user id, ts = timestamp, pk = autogenerated primary key
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    updated_at: {
      label: 'Updated At',
      auto: 'ts',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    }
  },

  // generated values
  pk: '', // either pk column, or multikey if blank
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
  // {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: mkDt() },
}