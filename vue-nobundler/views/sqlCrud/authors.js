const template = /*html*/`
<crud-base table-name="authors" :page-size="3" :page-size-list="[3, 5, 10]"></crud-base>
`

import CrudBase from '../../components/crudbase.js'

export default {
  template,
  components:{
    CrudBase 
  },
  setup() {
    return {
    }
  }
}
