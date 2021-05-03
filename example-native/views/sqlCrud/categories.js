const template = /*html*/`
<crud-base table-name="categories" :page-size="2" :page-size-list="[2, 4]"></crud-base>
`

const { onMounted } = Vue

import CrudBase from '../../components/crudbase.js'

export default {
  template,
  components:{
    CrudBase 
  },
  setup() {
    onMounted(async () => {
    })
    return {
    }
  }
}
