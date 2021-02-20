<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Form">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Activity name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Activity zone">
          <a-select v-model:value="formState.region" placeholder="please select your zone">
            <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Activity time">
          <a-date-picker
            v-model:value="formState.date1"
            show-time
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="Instant delivery">
          <a-switch v-model:checked="formState.delivery" />
        </a-form-item>
        <a-form-item label="Activity type">
          <a-checkbox-group v-model:value="formState.type">
            <a-checkbox value="1" name="type">Online</a-checkbox>
            <a-checkbox value="2" name="type">Promotion</a-checkbox>
            <a-checkbox value="3" name="type">Offline</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="Resources">
          <a-radio-group v-model:value="formState.resource">
            <a-radio value="1">Sponsor</a-radio>
            <a-radio value="2">Venue</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Activity form">
          <a-input v-model:value="formState.desc" type="textarea" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">Create</a-button>
          <a-button style="margin-left: 10px">Cancel</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Transfer" :disabled="false">
      <a-transfer
        :data-source="mockData"
        show-search
        :list-style="{
          width: '250px',
          height: '300px',
        }"
        :operations="['to right', 'to left']"
        :target-keys="targetKeys"
        :render="item => `${item.title}-${item.description}`"
        @change="handleChange"
      >
        <template #footer>
          <a-button size="small" style="float: right; margin: 5px" @click="getMock">reload</a-button>
        </template>
        <template #notFoundContent>
          <span>没数据</span>
        </template>
      </a-transfer>
    </a-collapse-panel>
  </a-collapse>

</template>
<script>
import { ref, reactive, toRaw, watch, onMounted } from 'vue';
export default {
  setup() {
    const mockData = ref([]); // transfer
    const targetKeys = ref([]);
    const getMock = () => {
      const keys = [];
      const mData = [];

      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1,
        };

        if (data.chosen) {
          keys.push(data.key);
        }

        mData.push(data);
      }

      mockData.value = mData;
      targetKeys.value = keys;
    };

    const handleChange = (keys, direction, moveKeys) => {
      targetKeys.value = keys;
      console.log(keys, direction, moveKeys);
    };
    onMounted(() => {
      getMock();
    });

    const activeKey = ref(['1']); // accordian
    watch(activeKey, val => {
      console.log(val);
    });


    const formState = reactive({ // form
      name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });

    const onSubmit = () => {
      console.log('submit!', toRaw(formState));
    };

    return {
      activeKey, // form

      mockData, // transfer
      targetKeys,
      handleChange,
      getMock,

      labelCol: { // form
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
      onSubmit,
    };
  },
}
</script>