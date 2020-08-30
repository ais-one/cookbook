module.exports = {
    db: 'mongo',
    name: 'grade',
    create: false,
    update: false,
    delete: false,
    import: false,
    export: false,
    multiSelect: false,
    cols: {
      _id: { // primary key column, _id for mongodb
        label: 'ID',
        auto: 'pk',
        table: 'hide',
        filter: 'hide',
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
        input: '',
      },
      grade: {
        label: 'Grade',
        type: 'string',
        input: '',
      },
    },
    pk: '',
    multiKey: [],
    required: [],
    auto: [],
    nonAuto: []
  }