// for UI usage only...
module.exports = {
  db: 'knex',
  conn: 'knex1',
  name: 'pages',
  create: true,
  update: true,
  delete: -1,
  import: true,
  export: true,
  multiSelect: true, // multiple selection
  cols: {
    id: { // primary key column, _id for mongodb (can cause error in mongodb)
      label: 'ID',
      auto: 'pk',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    content: {
      label: 'Content',
      type: 'string',
      filter: true,
      default: '',
      ui: {
        tag: 'input'
      },
    },
    bookId: {
      label: 'Book', // need to check on auto complete
      type: 'integer', // string
      filter: true,
      options: {
        parentCol: '', // use column to get parent value affecting a child
        parentTableColName: '', // the column name in the parent table
        childCol: '', // affect child column in this table
        dbName: 'knex',
        conn: 'knex1',
        tableName: 'books',
        limit: 8,
        strict: true, // cannot enter own values, must be selected
        key: 'id',
        text: 'name'
      },
      ui: {
        tag: 'bwc-combobox', // input
        valueType: 'text',
        writeType: 'key',
      }
    },
    created_at: {
      label: 'Created At',
      auto: 'ts', // autogenerated field... user = user id, ts = timestamp, pk = autogenerated primary key
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
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
  // {id: 1, name: 'book1', categoryId: 1, rating: 5, yearPublished: '2004', created_at: mkDt() },
}