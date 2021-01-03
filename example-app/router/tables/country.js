module.exports = {
  db: 'mongo',
  name: 'country',
  create: true,
  update: true,
  delete: true,
  import: true,
  export: true,
  multiSelect: true,
  cols: {
    _id: { // primary key column, _id for mongodb
      // label: 'ID',
      auto: 'pk',
      table: 'hide',
      filter: 'hide',
      add: 'hide',
      edit: 'readonly'
    },
    code: {
      label: 'Code',
      type: 'string',
      // OLD
      input: '',
      // NEW
      ui: {
        tag: 'input'
      }
    },
    name: {
      label: 'Name',
      type: 'string',
      // OLD
      input: '',
      // NEW
      ui: {
        tag: 'input'
      }
    }
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}