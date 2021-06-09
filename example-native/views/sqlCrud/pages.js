const template = /*html*/`
<crud-base table-name="pages" :page-size="4" :page-size-list="[4, 8, 12]"></crud-base>
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
