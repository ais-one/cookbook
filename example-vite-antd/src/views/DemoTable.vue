<template>
  <div>
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" header="Filter">
        <a-form layout="vertical" :model="formState">
          <a-form-item>
            <a-input v-model:value="formState.name" type="text" placeholder="Search By Name"></a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="formState.startDate" type="date" placeholder="Start Date">
              <template #prefix>
                <a-tooltip title="Start Date"><info-circle-outlined/></a-tooltip>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="formState.endDate" type="date" placeholder="End Date">
              <template #prefix>
                <a-tooltip title="End Date"><info-circle-outlined/></a-tooltip>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="Records Status">
            <a-select v-model:value="formState.active" placeholder="Active Record?">
              <a-select-option value="">All</a-select-option>
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="inactive">Inactive</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-select
              mode="multiple"
              placeholder="Please select one or more items"
            >
              <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="button">Filter</a-button>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
    </a-collapse>

    <a-divider />

    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template v-for="col in ['name', 'age', 'address']" #[col]="{ text, record }">
        <div :key="col">
          <a-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a @click="save(record.key)">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record.key)">Edit</a>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
// :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
import { cloneDeep } from 'lodash-es'
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
    slots: {
      customRender: 'name',
    },
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%',
    slots: {
      customRender: 'age',
    },
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%',
    slots: {
      customRender: 'address',
    },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    slots: {
      customRender: 'operation',
    },
  },
];
const data = [];

for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

export default {
  components: {
    UserOutlined,
    InfoCircleOutlined,
  },
  setup() {
    const dataSource = ref(data)
    const editableData = reactive({})

    const activeKey = ref(['1']) // collapse
    watch(activeKey, val => { })

    const formState = reactive({ // form
      name: '',
      startDate: null,
      endDate: null,
      active: ''
    });

    const state = reactive({ // table
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    const edit = key => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    };

    const save = key => {
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };

    const cancel = key => {
      delete editableData[key];
    };

    return {
      formState, // form

      activeKey, // collapse

      hasSelected, // table checkbox
      ...toRefs(state),
      onSelectChange,

      dataSource,
      columns,
      editingKey: '',
      editableData,
      edit,
      save,
      cancel,
    }
  },
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>