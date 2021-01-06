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
    _id: {
      label: 'ID',
      auto: 'pk',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    country_name: {
      label: 'Code',
      type: 'string',
      // OLD
      input: '',
      // NEW
      ui: {
        tag: 'input'
      },
    },
    code: {
      label: 'Code',
      type: 'string',
      // OLD
      input: '',
      // NEW
      ui: {
        tag: 'input'
      },
    },
    name: {
      label: 'Name',
      type: 'string',
      // OLD
      input: '',
      // NEW
      ui: {
        tag: 'input'
      },
    }
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}