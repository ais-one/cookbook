const template = /*html*/`
<div>
  <bwc-t4t-form
    :config="form.config"
    :record="form.record"
    mode="edit"
    @submit="submit"
    style="--bwc-t4t-form-height: calc(100vh - 150px);"
  ></bwc-t4t-form>
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

    const submit = (e) => console.log('submit', e.detail)

    onMounted(async () => {
      console.log('ui3 mounted!')
      t4t.setTableName('person')
      form.config = await t4t.getConfig()
      form.record = await t4t.findOne('5f3a35197dc9e61b64e0dea9')
      Object.assign(test, form.config)
      console.log(test, form.record)
      // for (var key in test) delete test[key]
      // Object.assign(test, {})
      // console.log(test.length)
      // console.log(form)
    })

    return {
      form,
      submit
    }
  }
}
