module.exports = {
  db: 'mongo',
  name: 'state',
  create: false,
  update: false,
  delete: false,
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
    country_name: {
      label: 'Code',
      type: 'string',
      input: '',
    },
    code: {
      label: 'Code',
      type: 'string',
      input: '',
    },
    name: {
      label: 'Name',
      type: 'string',
      input: '',
    }
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}