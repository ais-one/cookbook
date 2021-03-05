<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Parameters">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Job name">
          <a-input v-model:value="formState.jobName" />
        </a-form-item>

        <a-form-item label="Theme">
          <a-checkbox @change="onCheckAllChange">Select all</a-checkbox>
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.themes" @blur="blurSelect" @deselect="blurSelect">
            <template #clearIcon>
              <setting-outlined />
            </template>
            <a-select-option v-for="item in formState.themesList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Sub Theme">
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.subThemes" allowClear>
            <a-select-option v-for="item in formState.subThemesList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Token">
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.token">
            <a-select-option v-for="item in formState.tokenList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Channel">
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.channel">
            <a-select-option v-for="item in formState.channelList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Time Sensitive">
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.timeSensitive"  @blur="blurSelect2" @deselect="blurSelect2">
            <a-select-option v-for="item in formState.timeSensitiveList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Sub-Time Sensitive">
          <a-select mode="multiple" placeholder="Please select" v-model:value="formState.subTimeSensitive">
            <a-select-option v-for="item in formState.subTimeSensitiveList" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Donation" extra="Aggregate Donation">
          <a-radio-group v-model:value="formState.donor">
            <a-radio value="Average">Average</a-radio>
            <a-radio value="Max">Max</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Database">
          <a-select
            placeholder="Please select"
            v-model:value="formState.db"
          >
            <a-select-option value="NTUPortal.db">NTUPortal.db</a-select-option>
            <a-select-option value="Test.db">Test.db</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Force Include">
          <a-select
            mode="multiple"
            placeholder="Please select"
            v-model:value="formState.forceIncludes"
            style="width: 300px;"
          >
            <a-select-option v-for="item in forceListFiltered" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Force Exclude">
          <a-select
            mode="multiple"
            placeholder="Please select"
            v-model:value="formState.forceExcludes"
            style="width: 300px;"
          >
            <a-select-option v-for="item in forceListFiltered" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="onSubmit">Run</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Results" :disabled="false">
    </a-collapse-panel>
  </a-collapse>

</template>
<script>
import { ref, reactive, toRaw, watch, computed } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    SettingOutlined,
  },
  setup() {
    const activeKey = ref(['1']) // accordian
    watch(activeKey, val => console.log('watch activeKey', val))

    const formState = reactive({ // form
      jobName: '',
      db: 'NTUPortal.db',
      donor: 'Average',

      forceIncludes: [],
      forceExcludes: [],

      themes: [],
      themesList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],

      subThemes: [],
      subThemesList: [],
      subThemesMasterList: {
        'Asia': ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        'Europe': ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        'NA': ['United States', 'Canada'],
        'SA': ['Brazil', 'Argentina', 'Ecuador'],
        'Africa': ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        'ME': ['Egypt', 'Saudi Arabia', 'Afghanistan'],
      },
      token: [],
      tokenList: [],
      tokenMasterList: {
        'Asia': ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        'Europe': ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        'NA': ['United States', 'Canada'],
        'SA': ['Brazil', 'Argentina', 'Ecuador'],
        'Africa': ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        'ME': ['Egypt', 'Saudi Arabia', 'Afghanistan'],
      },
      channel: [],
      channelList: [],
      channelMasterList: {
        'Asia': ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        'Europe': ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        'NA': ['United States', 'Canada'],
        'SA': ['Brazil', 'Argentina', 'Ecuador'],
        'Africa': ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        'ME': ['Egypt', 'Saudi Arabia', 'Afghanistan'],
      },
      timeSensitive: [],
      timeSensitiveList: [],
      timeSensitiveMasterList: {
        'Asia': ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        'Europe': ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        'NA': ['United States', 'Canada'],
        'SA': ['Brazil', 'Argentina', 'Ecuador'],
        'Africa': ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        'ME': ['Egypt', 'Saudi Arabia', 'Afghanistan'],
      },

      subTimeSensitive: [],
      subTimeSensitiveList: [],
      subTimeSensitiveMasterList: {
        'Asia': ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        'Europe': ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        'NA': ['United States', 'Canada'],
        'SA': ['Brazil', 'Argentina', 'Ecuador'],
        'Africa': ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        'ME': ['Egypt', 'Saudi Arabia', 'Afghanistan'],
      },

    })

    const onCheckAllChange = e => {
      if (e.target.checked === true) {
        formState.themes = [...formState.themesList]
        // select all subs
        blurSelect()
      } else {
        formState.themes = []
        // clear all subs
        blurSelect()
      }
    }

    const blurSelect = () => {
      const key = 'themes'
      const subs = [
        { subKey: 'subThemes', subKeyMasterList: 'subThemesMasterList', subKeyList: 'subThemesList' },
        { subKey: 'token', subKeyMasterList: 'tokenMasterList', subKeyList: 'tokenList' },
        { subKey: 'channel', subKeyMasterList: 'channelMasterList', subKeyList: 'channelList' },
        { subKey: 'timeSensitive', subKeyMasterList: 'timeSensitiveMasterList', subKeyList: 'timeSensitiveList' },
      ]

      for (let sub of subs) { // all dropdowns affected
        const { subKey, subKeyMasterList, subKeyList } = sub
        const keys = {}
        const list = []
        const newSelected = []

        for (let _item of formState[key]) { // loop theme from themes
          for (let _subItem of formState[subKeyMasterList][_item]) { // loop through every subTheme in a theme
            if (!keys[_subItem]) {
              list.push(_subItem)
              keys[_subItem] = true
              const found = formState[subKey].find(item => item === _subItem)
              if (found) newSelected.push(found)
            }
          }
        }
        formState[subKey] = [...newSelected]
        formState[subKeyList] = [...list]
      }
    }

    const blurSelect2 = () => {
      const key = 'timeSensitive'
      const subs = [
        { subKey: 'subTimeSensitive', subKeyMasterList: 'subTimeSensitiveMasterList', subKeyList: 'subTimeSensitiveList' },
      ]

      for (let sub of subs) { // all dropdowns affected
        const { subKey, subKeyMasterList, subKeyList } = sub
        const keys = {}
        const list = []
        const newSelected = []

        for (let _item of formState[key]) { // loop theme from themes
          for (let _subItem of formState[subKeyMasterList][_item]) { // loop through every subTheme in a theme
            if (!keys[_subItem]) {
              list.push(_subItem)
              keys[_subItem] = true
              const found = formState[subKey].find(item => item === _subItem)
              if (found) newSelected.push(found)
            }
          }
        }
        formState[subKey] = [...newSelected]
        formState[subKeyList] = [...list]
      }
    }

    const forceListFiltered = computed(
      () => forceList.filter(o => !formState.forceIncludes.includes(o) && !formState.forceExcludes.includes(o))
    )
    const forceList = ['aa1', 'aa22', 'aa23', 'aa4', 'aa5', 'bb1', 'bb22', 'bb23', 'bb4', 'bb5']

    const onSubmit = () => {
      console.log('submit!', toRaw(formState))
    }

    return {
      forceListFiltered,

      activeKey, // collapse

      labelCol: { // form
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
      onSubmit,

      blurSelect,
      blurSelect2,
      onCheckAllChange,

      // :tip-formatter="formatter"
      // const formatter = value => {
      //   return `${value}%`;
      // }
    }
  },
}
</script>
