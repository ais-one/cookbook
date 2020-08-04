module.exports = {
  db: 'knex',
  name: 'country',
  cols: {
    _id: { // primary key column, _id for mongodb
      label: 'ID',
      auto: 'pk'
    },
    code: {
      label: 'Code',
      type: 'string',
      formEditor: '',
    },
    name: {
      label: 'Name',
      type: 'string',
      formEditor: '',
    }
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}