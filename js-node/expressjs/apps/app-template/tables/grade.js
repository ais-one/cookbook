module.exports = {
  db: 'mongo',
  conn: 'mongo1',
  name: 'grade',
  create: false,
  update: false,
  delete: 0,
  import: false,
  export: false,
  multiSelect: false,
  cols: {
    _id: {
      label: 'ID',
      auto: 'pk',
      hide: true,
      add: 'hide',
      edit: 'readonly'
    },
    personId: {
      label: 'Person ID',
      add: 'readonly',
      edit: 'readonly'
    },
    subject: {
      label: 'Subject',
      type: 'string',
      ui: {
        tag: 'input'
      },
    },
    grade: {
      label: 'Grade',
      type: 'string',
      ui: {
        tag: 'input'
      },
    },
  },
  pk: '',
  multiKey: [],
  required: [],
  auto: [],
  nonAuto: []
}
