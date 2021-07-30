module.exports = {
  db: 'mongo', // knex / mongodb
  conn: 'mongo1',
  name: 'person', // table name
  create: true, // able to add record,
  update: true, // able to update
  delete: -1, // able to delete record(s), -1(no delete limit), 0 (cannot delete), delete limit
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
      ui: {
        tag: 'input', // input (number, date, time, datetime, file, pattern), select, textarea, combobox, link to child table?
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
      ui: {
        tag: 'input',
        attrs: { type: 'text', min: 0, max: 20 }
      },

      rules: {
        min: 0, max: 20
      },
      width: 250
    },
    country: {
      label: 'Country', // key text...
      type: 'string',
      filter: true,
      options: {
        parentCol: '', // use column to get parent value affecting a child
        parentTableColName: '', // the column name in the parent table
        childCol: 'state', // affect child column in this table
        dbName: 'mongo',
        conn: 'mongo1',
        tableName: 'country',
        limit: 8,
        strict: true, // cannot enter own values, must be selected
        key: 'code',
        text: 'name'
      },
      ui: {
        tag: 'bwc-combobox', // input
        valueType: '', // '' = string, otherwise it is object key to display
        writeType: '',
      }
    },
    state: {
      label: 'State', // key text...
      type: 'string',
      filter: true,
      options: {
        parentCol: 'country',
        parentTableColName: 'country_name',
        childCol: '',
        dbName: 'mongo',
        conn: 'mongo1',
        tableName: 'state',
        limit: 8,
        key: 'code',
        text: 'name'
      },
      ui: {
        tag: 'bwc-combobox',
        valueType: '',
        writeType: '',
        attrs: {
          multiple: true,
          tagLimit: 3
        }
      }
    },
    sex: { // single select
      label: 'Sex',
      type: 'string',
      filter: true,
      default: 'M',
      ui: {
        tag: 'select',
        options: [
          { key: '', text: '' },
          { key: 'M', text: 'Male' },
          { key: 'F', text: 'Female' }
        ]  
      }
    },
    subjects: { // multi select
      label: 'Subjects',
      type: 'string',
      ui: {
        tag: 'select',
        attrs: {
          multiple: true,
          size : 3,
        },
        options: [
          { key: 'EL1', text: 'English' },
          { key: 'EM', text: 'E Maths' },
          { key: 'AM', text: 'A Maths' },
          { key: 'PHY', text: 'Physics' },
          { key: 'CHEM', text: 'Chemistry' }
        ]
      }
    },
    age: { // integer
      label: 'Age',
      type: 'integer',
      filter: true,
      ui: {
        tag: 'input',
        attrs: { type: 'number', min: 10, max: 90, step: 1 }
      },
      rules: {
        min: 10, max: 90
      }
    },
    gpa: { // decimal
      label: 'GPA',
      type: 'decimal',
      filter: true,
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
      ui: {
        tag: 'input',
        attrs: { type: 'date' }
      },
    },
    birthTime: { // HHmm (no timezone - assume local - store as string)
      label: 'Birth time',
      type: 'string', // time
      filter: true,
      ui: {
        tag: 'input',
        attrs: { type: 'time' }
      }
    },
    birthDateTimeTz: { // date with time info
      label: 'Datetime with TZ',
      type: 'datetime',
      filter: true,
      ui: {
        tag: 'input',
        attrs: { type: 'datetime-local' }
      }
    },
    website: { // test file upload
      label: 'URL',
      type: 'string',
      ui: {
        tag: 'input',
        attrs: { type: 'file' }
      }
    },
    remarks: { // text area
      label: 'Remarks',
      type: 'string',
      ui: {
        tag: 'textarea' // textarea
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
