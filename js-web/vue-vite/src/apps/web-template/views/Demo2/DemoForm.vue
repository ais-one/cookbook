<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Form - Test Upload Files and JSON data">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-upload-dragger
          :file-list="form1.files"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          :multiple="true"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">Click or drag file to this area to upload</p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
          </p>
        </a-upload-dragger>
        <a-form-item label="Text Input">
          <a-input v-model:value="form1.text" />
        </a-form-item>
        <a-form-item label="Number Input">
          <a-input v-model:value="form1.number" type="number" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.native="onSubmit1">Upload</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="2" :header="`Form - Test Various Inputs (Store Counter: ${storeCounter})`">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Test Slider">
          <a-input-group compact>
            <a-slider style="width: 80%;" :min="1" :max="20" v-model:value="formState.rating" />
            <a-input style="width: 16%; float: right;" v-model:value="formState.rating" />
          </a-input-group>
        </a-form-item>
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
          <!-- <a-date-picker
            v-model:value="formState.date1" show-time type="date" placeholder="Pick a date" style="width: 100%"
          /> -->
          <a-input
            v-model:value="mainStore.form.date1" type="date" placeholder="Pick a date" style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="Instant delivery">
          <a-switch v-model:checked="mainStore.form.delivery" />
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
        <a-form-item label="Modify Store Counter">
          <a-input v-model:value="storeCounter" type="number" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.native="onSubmit">Create</a-button>
          <a-button style="margin-left: 10px">Cancel</a-button>
        </a-form-item>
        Create Response: {{ submitResult || 'No Response' }}
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="Transfer" :disabled="false">
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
    <a-collapse-panel key="4" :header="`Form - Test Web Socket`">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Message To Send">
          <a-input v-model:value="wsMsg" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.native="onWsMsg">Send WS Message</a-button>
        </a-form-item>
        WS Rx Message: {{ mainStore.message || 'No WS Message' }}
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="5" :header="`Form - Test Forbidden & Not Found`">
      <a-button @click="goToForbidden">Forbidden</a-button>
      <a-button @click="goToNotFound">Not Found</a-button>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
// v-model:fileList="form1.files"
import { useMainPiniaStore } from '../../store.js'
import { useRouter } from 'vue-router'

import { ref, reactive, toRaw, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'

import { VITE_API_URL } from '/config.js'
import { http, ws } from '/src/services.js'

export default {
  components: {
    InboxOutlined
  },
  setup() {
    const mainStore = useMainPiniaStore()
    const router = useRouter()
    const submitResult = ref('')
    const mockData = ref([]) // transfer
    const targetKeys = ref([])
    const getMock = () => {
      const keys = []
      const mData = []

      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1,
        }

        if (data.chosen) {
          keys.push(data.key)
        }

        mData.push(data)
      }

      mockData.value = mData
      targetKeys.value = keys
    }

    const handleChange = (keys, direction, moveKeys) => {
      targetKeys.value = keys;
      // console.log(keys, direction, moveKeys)
    }
    onMounted(() => {
      getMock()
      // ws.setMessage((e) => {
      //   console.log('ws onmessage', e.data)
      //   mainStore.message = e.data
      // })
    })
    onBeforeUnmount(() => {
      // ws.setMessage((e) => console.log('ws onmessage', e.data))
    })

    const activeKey = ref(['1']); // accordian
    watch(activeKey, val => console.log(val))

    const formState = reactive({ // form
      name: '',
      region: undefined,
      // date1: undefined,
      // delivery: false,
      type: [],
      resource: '',
      desc: '',
      rating: 5,
    })

    const onSubmit = async () => {
      console.log('submit!')
      try {
        const body = toRaw(formState)
        console.log('submit!', body)
        const { data } = await http.post(VITE_API_URL + '/api/healthcheck', body)
        console.log(data)
        submitResult.value = JSON.stringify(data)
      } catch (e) {
        console.log('onSubmit Error', e.toString())
        submitResult.value = e.toString()
      }
    }

    const form1 = reactive({
      files: [],
      text: 'abcd',
      number: 3
    })
    const onSubmit1 = async () => {
      try {
        console.log('submit', form1.files)

        // submit the data here
        const form = new FormData()
        for (let file of form1.files) {
          form.append('myfiles', file)
        }
        form.append('mydata', JSON.stringify({
          text: form1.text,
          number: form1.number
        }))
        const { data } = await http.post(VITE_API_URL + '/api/custom-app/uploads/file-and-json', form)
        console.log(data)
      } catch (e) {
        console.log('onSubmit1 Error', e.toString())
      }
    }
    const handleRemove = file => {
      const newFileList = form1.files.filter(f => f.uid !== file.uid) // do not handle if same filename
      form1.files = newFileList
    };
    const beforeUpload = file => {
      console.log('beforeUpload', file)
      const found = form1.files.find(f => f.name === file.name)
      console.log(form1.files)
      if (!found) {
        console.log('adding')
        form1.files = [...form1.files, file]
      } else {
        // remove from list?...
      }
      return false
    }

    watch(
      () => mainStore.form,
      (currentValue, oldValue) => {
        console.log('watch', currentValue, oldValue)
      },
      { deep: true }
    )

    const wsMsg = ref('') // websockets
    const onWsMsg = (e) => {
      ws.send(wsMsg.value)
    }

    const goToNotFound = () => router.push('/notfound')
    const goToForbidden = () => router.push('/forbidden')

    return {
      form1,
      onSubmit1,
      beforeUpload,
      handleRemove,

      submitResult,
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

      mainStore,

      storeCounter: computed({
        get: () => mainStore.counter,
        set: val => mainStore.counter = val
      }),

      wsMsg,
      onWsMsg, // websockets
      goToNotFound,
      goToForbidden
    }
  }
}
</script>
