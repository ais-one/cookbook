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
      auto: 'pk',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    name: {
      label: 'Name',
      type: 'string',
      filter: true,
      add: '',
      edit: '',
      default: '',

      // OLD
      input: 'textfield',
      // NEW
      ui: {
        tag: 'input'
      },
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