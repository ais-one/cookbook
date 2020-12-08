// for UI usage only...
module.exports = {
  db: 'knex',
  name: 'categories',
  create: true,
  update: true,
  delete: true,
  import: true,
  export: true,
  multiSelect: true, // multiple selection
  cols: {
    id: { // primary key column, _id for mongodb (can cause error in mongodb)
      label: 'ID',
      auto: 'pk', // should override multiKey
      table: 'hide',
      filter: 'hide',
      add: 'hide',
      edit: 'readonly'
    },
    name: {
      label: 'Name',
      type: 'string', // string, integer, decimal, datetime, date, time, boolean (follows the DB datatype)
      input: 'textfield', // textfield, textarea, autocomplete, number, select, multi-select, date, time, datetime, upload, link - to child table
      // TBD input attributes?, should input follow the html tag? or should we map to html tag?
      table: '', // truthy means hide column on table,
      filter: '', // truthy means hide column on filter,
      add: '', // 'hide', '' - empty string means can show and edit
      edit: '', // 'hide', 'readonly', '' - empty string means can show and edit
      default: '', // a default value (today? now?)
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