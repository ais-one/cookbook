<template>
  <a-table :columns="columns" :data-source="dataSource" bordered>
    <template v-for="col in ['name', 'age', 'address']" #[col]="{ text, record }" :key="col">
      <div>
        <a-input
          v-if="editableData[record.key]"
          :value="editableData[record.key][col]"
          @change="(e) => editableData[record.key][col] = e.target.value"
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
</template>
<script>
import { cloneDeep } from 'lodash-es';
import { defineComponent, reactive, ref } from 'vue';
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

export default defineComponent({
  setup() {
    const dataSource = ref(data);
    const editableData = reactive({});

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
      dataSource,
      columns,
      editingKey: '',
      editableData,
      edit,
      save,
      cancel,
    };
  },
});
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
