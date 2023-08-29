module.exports = {
  db: 'mongo',
  conn: 'mongo1',
  name: 'country',
  create: true,
  update: true,
  delete: -1,
  import: true,
  export: true,
  multiSelect: true,
  cols: {
    _id: {
      label: 'ID',
      auto: 'pk',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    code: {
      label: 'Code',
      type: 'string',
      ui: {
        tag: 'input'
      }
    },
    name: {
      label: 'Name',
      type: 'string',
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
