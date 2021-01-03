const template = /*html*/`
<div>
  <h1>UI 3 - Form</h1>
  <bwc-t4t-form :config="form.config" :record="form.record" mode="edit"></bwc-t4t-form>
</div>
`

import * as t4t from '/esm/t4t-fe.js'
const { onMounted, reactive } = Vue

export default {
  template,
  setup() {
    const form = reactive({
      config: null,
      record: null
    })

    const test = reactive({})

    onMounted(async () => {
      console.log('ui3 mounted!')

      t4t.setTableName('person')

      form.config = await t4t.getConfig()
      form.record = await t4t.findOne('5f3a35197dc9e61b64e0dea9')
      Object.assign(test, form.config)
      console.log(test)
      // for (var key in test) delete test[key]
      // Object.assign(test, {})
      // console.log(test.length)
      // console.log(form)
    })

    return {
      form,
    }
  }
}
