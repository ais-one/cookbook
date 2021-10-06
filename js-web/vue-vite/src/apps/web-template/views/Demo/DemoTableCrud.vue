<template>
  <div>
    <div class="table-operations">
      <a-button @click="filterOpen">Filter</a-button>
      <a-button @click="() => formOpen(null)">Create</a-button>
      <a-button @click="deleteItems">Delete</a-button>
    </div>
    <a-table
      :columns="table.columns"
      :data-source="table.data"
      :pagination="table.pagination"
      :scroll="table.scroll"
      :loading="table.loading"
      size="small"
      @change="handleTableChange"
      rowKey="id"
      :customRow="customRow"
      :customHeaderRow="customHeaderRow"
      :row-selection="rowSelection"
    >
      <template #action="item">
        <a-button @click="() => clickId(item)">{{ item.text }}</a-button>
      </template>
    </a-table>
    <a-drawer title="Filters" :width="512" :visible="filterShow" :body-style="{ paddingBottom: '80px' }" @close="filterClose" placement="left">
      <a-form layout="vertical">
        <a-form-item v-for="(filter, index) of table.filters" :key="index">
          <a-input-group compact>
            <a-select  style="width: 125px;" placeholder="Column" v-model:value="filter.col">
              <a-select-option v-for="col of table.filterCols" :key="col" :value="col">{{col}}</a-select-option>
            </a-select>
            <a-select style="width: 75px;" placeholder="Operation" v-model:value="filter.op">
              <a-select-option v-for="op of table.filterOps" :key="op" :value="op">{{op}}</a-select-option>
            </a-select>
            <a-input style="width: 125px;" placeholder="Value" v-model:value="filter.val" />
            <a-select style="width: 75px;" placeholder="And Or" v-model:value="filter.andOr">
              <a-select-option v-for="andOr of table.filterAndOr" :key="andOr" :value="andOr">{{andOr}}</a-select-option>
            </a-select>
            <a-button type="primary" @click="() => filterDelete(index)"><template #icon><CloseOutlined /></template></a-button>
          </a-input-group>
        </a-form-item>
      </a-form>
      <a-button :disabled="table.filters.length > 9" style="margin-bottom: 8px;" @click="filterAdd">Add Filter</a-button>
      <div
        :style="{
          position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1,
        }"
      >
        <a-button type="primary" @click="filterApply">Apply</a-button>
      </div>
    </a-drawer>
    <a-drawer :title="formMode" :width="480" :visible="!!formMode" :body-style="{ paddingBottom: '80px' }" @close="formClose">
      <a-form layout="vertical" :model="table.formData" :rules="table.formRules">
        <template v-for="(val, col) of table.formData" :key="col">
          <a-form-item :label="table.formConfig[col].title">
            <a-textarea
              v-if="table.formConfig[col].type==='textarea'"
              v-model:value="table.formData[col]"
              :rows="4"
              :required="table.formConfig[col].required"
              :disabled="table.formConfig[col].disabled"
            />
            <a-input
              v-else
              v-model:value="table.formData[col]" 
              :required="table.formConfig[col].required"
              :disabled="table.formConfig[col].disabled"
            />
          </a-form-item>
        </template>
        <!--
        <a-form-item label="Owner" name="owner">
          <a-select placeholder="Please a-s an owner" v-model:value="form.form.owner">
            <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
            <a-select-option value="mao">Maomao Zhou</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="DateTime" name="dateTime">
          <a-date-picker v-model:value="form.form.dateTime" style="width: 100%" :get-popup-container="trigger => trigger.parentNode" />
        </a-form-item>
        <a-form-item label="Description" name="description">
        </a-form-item>
        -->
      </a-form>
      <div
        :style="{
          position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="formClose">Cancel</a-button>
        <a-button type="primary" @click="formSubmit">Submit</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
// TBD
// filters
// update, create, delete (multi select), export to CSV?
/*
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "username": "Kamren",
    "email": "Lucio_Hettinger@annie.ca",
    "address": {
      "street": "Skiles Walks",
      "suite": "Suite 351",
      "city": "Roscoeview",
      "zipcode": "33263",
      "geo": {
        "lat": "-31.8129",
        "lng": "62.5342"
      }
    },
    "phone": "(254)954-1289",
    "website": "demarco.info",
    "company": {
      "name": "Keebler LLC",
      "catchPhrase": "User-centric fault-tolerant solution",
      "bs": "revolutionize end-to-end systems"
    }
  },
*/

import { reactive, ref, computed, watch, onMounted } from 'vue'
import { CloseOutlined  } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'

const filterTemplate = {
  col: '',
  op: '=',
  andOr: 'and',
  val: ''
}

export default {
  components: {
    CloseOutlined
  },
  setup() {
    // table information
    const table = reactive({
      scroll: { x: 1800, y: 240 },
      pagination: { pageSize: 8, total: 0, current: 1 }, // start at page 1, 8 records per page
      sorter: null, // single sort only

      filters: [],
      filterCols: [],
      filterOps: ['like', '=', '!=', '>=', '>', '<', '<='], // isNull, isEmpty
      filterAndOr: ['and', 'or'],

      data: [],
      loading: false,
      columns: [
        { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left', slots: { customRender: 'action' }, add: 'hidden', edit: 'readonly' },
        { title: 'Name', dataIndex: 'name', filter: true },
        { title: 'Username', dataIndex: 'username', width: 120, sorter: true, filter: true },
        { title: 'E-mail', dataIndex: 'email', sorter: true, required: true },
        { title: 'Address', dataIndex: 'address', filter: true },
        { title: 'Latitude', dataIndex: 'lat', width: 100 },
        { title: 'Longitude', dataIndex: 'lng', width: 120 },
        { title: 'Phone', dataIndex: 'phone', width: 150 },
        { title: 'Website', dataIndex: 'website' },
        { title: 'Company', dataIndex: 'company' },
        { title: 'Focus', dataIndex: 'bs', edit: 'readonly', type: 'textarea' },
      ],

      formConfig: {},
      formData: {},
      formRules: {}
    })

    const form = reactive({
      rules: {
        name: [ { required: true, message: 'Please enter user name', }, ],
        owner: [ { required: true, message: 'Please select an owner', }, ],
        type: [ { required: true, message: 'Please choose the type', }, ],
        approver: [ { required: true, message: 'Please choose the approver', }, ],
        dateTime: [ { required: true, message: 'Please choose the dateTime', type: 'object', }, ],
        description: [ { required: true, message: 'Please enter url description', }, ],
      }

    })

    const filterShow = ref(false)
    const filterOpen = () => filterShow.value = true
    const filterClose = () => filterShow.value = false
    const filterApply = () => {
      filterShow.value = false
      find()
    }
    const filterAdd = () => {
      table.filters.push({ ...filterTemplate })
    }
    const filterDelete = (index) => {
      table.filters.splice(index, 1);
      console.log('filterDelete', index) // TBD
    }

    const deleteItems = async () => {
      console.log('deleteItems', rowSelection.selectedRowKeys)
    }

    const formMode = ref(false) // false, add or edit
    const formOpen = (item) => {
      // TBD findOne
      table.formData = {}
      table.formConfig = {}
      const mode = item ? 'edit' : 'add'
      const cols = table.columns.filter(col => col[mode] !== 'hidden')
      for (let col of cols) {
        table.formData[col.dataIndex] = mode === 'add' ? '' : item?.record[col.dataIndex]
        table.formConfig[col.dataIndex] = {
          title: col.title,
          type: col.type || 'text', // input type
          required: col.required,
          disabled: col && col[mode] === 'readonly', // undefined, 'readonly' // 'hidden' has been filtered out
        }
        // table.formRules
      }
      formMode.value = mode
    }
    const formClose = () => formMode.value = false
    const formSubmit = () => {
      notification.open({
        message: formMode.value === 'add' ? 'Record Added' : 'Record Updated',
        description: 'Display submit success or failure here...',
        duration: 4.5, // seconds
      })
      formMode.value = false
    }

    const rowSelection = reactive({
      selectedRowKeys: [],
      // Check here to configure the default column
      onChange: selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        rowSelection.selectedRowKeys = selectedRowKeys;
      }
    })
    // const hasSelected = computed(() => state.selectedRowKeys.length > 0);

    const flatten = (_in) => {
      const out = {
        id: _in.id,
        name: _in.name,
        username: _in.username,
        email: _in.email,
        address: `${_in.address.suite} ${_in.address.street} ${_in.address.city} ${_in.address.zipcode}`,
        lat: _in.address.geo.lat,
        lng: _in.address.geo.lng,
        phone: _in.phone,
        website: _in.website,
        company: _in.company.name,
        bs: _in.company.bs,
      }
      return out
    }

    const find = async () => {
      if (table.loading) return
      table.loading = true
      try {
        console.log(table.filters)
        const filters = JSON.stringify(table.filters) // [{col: "username", op: "=", andOr: "and", val: "aaa"}]
        const { field = null, order = null } = table.sorter || {} // console.log('table.sorter', field, order), field=, order=descend / ascend
        let url = `https://jsonplaceholder.typicode.com/users?_page=${table.pagination.current}&_limit=${table.pagination.pageSize}&_filters=${filters}`
        console.log(url)
        if (field && order) {
          url += `&_sort=${field}&_order=${order === 'ascend' ? 'asc' : 'desc'}`
        }
        const res = await fetch(url)
        const json = await res.json()
        console.log(json)
        table.data = json.map(item => flatten(item))
        table.pagination.total = 10 // currently has up to 10 records
      } catch (e) {
        alert('Error find' + e.toString())        
      }
      table.loading = false
    }

    const findOne = async (id) => {
      let rv = null
      if (table.loading) return
      table.loading = true
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        const json = await res.json()
        rv = flatten(json)
        console.log(data)
      } catch (e) {
        alert('Error findOne' + e.toString())        
      }
      table.loading = false
      return rv
    }

    const clickId = (item) => {
      formOpen(item)
      // alert('See console.log for output')
      // console.log('clickId', item)
    }

    onMounted(async () => {
      table.filterCols = table.columns.filter(col => col.filter).map(col => col.dataIndex)
      await find()
    })

    const handleTableChange = (pagination, filters, sorter) => {
      console.log('handleTableChange', pagination, filters, sorter)
      table.pagination = { ...pagination }
      table.sorter = { ...sorter }
      // use our own filters instead
      find()
    }

    const customRow = (record) => {
      return {
        // xxx, // props
        onClick: (event) => console.log('onClick', event, record), // click row
        // onDblclick: (event) => {}, // double click row
        // onContextmenu: (event) => {}  // right button click row
        // onMouseenter: (event) => {}   // mouse enter row
        // onMouseleave: (event) => {}   // mouse leave row
      }
    }
    const customHeaderRow = (column) => {
      return {
        // onClick: () => console.log(column), // click header row
      }
    }

    return {
      table,
      handleTableChange,
      clickId,
      customRow,
      customHeaderRow,

      filterShow,
      filterOpen,
      filterClose,
      filterAdd,
      filterApply,
      filterDelete,

      form, // TOREMOVE
      formMode,
      formOpen,
      formClose,
      formSubmit,

      rowSelection,
      deleteItems,
    }
  },
}
</script>

<style scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
</style>