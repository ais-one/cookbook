module.exports = {
  db: 'mongo',
  name: 'country',
  delete: true,
  create: true,
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
      input: '',
      // multiKey: true
    },
    name: {
      label: 'Name',
      type: 'string',
      input: '',
      // multiKey: true
    }
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}