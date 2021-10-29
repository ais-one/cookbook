<template>
  <div class="evens">
    <a-card title="Field Name" class="ds-card">
      <a-form layout="vertical" :model="formState">
        <a-form-item label="Field A">
          <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card v-for="i in 9" :key="i" hoverable class="ds-card">
      <template #cover>
        <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
      </template>
      <template class="ant-card-actions" #actions>
        <setting-outlined key="setting" />
        <edit-outlined key="edit" />
        <ellipsis-outlined key="ellipsis" />
      </template>
      <a-card-meta title="Card title" description="This is the description">
        <template #avatar>
          <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
  },
  setup() {
    const formState = reactive({
      fieldA: ''
    })
    return {
      formState
    }
  },
}
</script>

<style>
.evens {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: space-around;
}

.ds-card {
  width: 300px;
  margin: 8px 16px;
}
</style>
