const template = /*html*/`
<div>
  <h1>UI 2</h1>
  <bwc-t4t-form :config="form.config" :record="form.record"></bwc-t4t-form>
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

    onMounted(async () => {
      console.log('ui2 mounted!')

      t4t.setTableName('person')

      form.config = await t4t.getConfig()
      form.record = await t4t.findOne('5f3a35197dc9e61b64e0dea9')
      console.log(form)
    })

    return {
      form,
    }
  }
}
