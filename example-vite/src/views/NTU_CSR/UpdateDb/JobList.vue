<template>
  <div>
    <a-table :dataSource="dataSource" :columns="columns" />
  </div>
</template>
<script>
import { ref, reactive, toRaw } from 'vue';

export default {
  setup() {
    const dataSource = [
      {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
      },
      {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
      },
    ]

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
    ]

    const activeKey = ref(['1'])

    const formState = reactive({ // form
      jobName: '',
      db: 'NTUPortal.db',
      donor: 'Average',
      themes: [],
      themesList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],
    })

    const onSubmit = () => {
      console.log('submit!', toRaw(formState))
    }

    return {
      activeKey,
      formState,
      onSubmit,
      dataSource,
      columns,
    }
  },
}
</script>
