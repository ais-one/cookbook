module.exports = {
  db: 'mongo',
  name: 'country',
  cols: {
    _id: { // primary key column, _id for mongodb
      // label: 'ID',
      auto: 'pk'
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