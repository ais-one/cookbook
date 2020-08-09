module.exports = {
  db: 'mongo',
  name: 'country',
  delete: true, // able to delete record(s)
  create: true, // able to add record,
  multiSelect: true, // multiple selection
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