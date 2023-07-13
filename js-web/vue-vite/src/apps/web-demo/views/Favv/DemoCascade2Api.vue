<template>
  <a-form :model="formState" layout="vertical">
    <a-form-item label="Continents">
      <a-checkbox @change="onCheckAllChange">Select all</a-checkbox>
      <!-- v-model:checked="checkAll" -->
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.continents" @blur="blurSelect" @deselect="blurSelect">
        <template #clearIcon><setting-outlined /></template>
        <a-select-option v-for="item in formState.continentsList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Countries East Hemisphere">
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.countriesEast" allow-clear>
        <a-select-option v-for="item in formState.countriesEastList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Countries West Hemisphere">
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.countriesWest" allow-clear @blur="blurSelect2" @deselect="blurSelect2">
        <a-select-option v-for="item in formState.countriesWestList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Country States (West)">
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.westCountryStates">
        <a-select-option v-for="item in formState.westCountryStatesList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="onSubmit">Run</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { ref, reactive, toRaw, watch, onMounted, computed } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { http } from '/src/services.js'
import { VITE_API_URL } from '/config.js'

export default {
  components: {
    SettingOutlined
  },
  setup() {
    const formState = reactive({
      continents: [], // Level 1
      continentsList: [],

      countriesEast: [], // Level 2
      countriesEastList: [],

      countriesWest: [], // Level 2
      countriesWestList: [],

      westCountryStates: [], // Level 3
      westCountryStatesList: []
    })

    onMounted(async () => {
      try {
        const { data } = await http.get(VITE_API_URL + '/api/custom-app/cascade/continents')
        formState.continentsList = [...data]
      } catch (e) {
        console.log(e.toString())
      }
    })

    const onCheckAllChange = (e) => {
      if (e.target.checked === true) {
        formState.continents = [...formState.continentsList]
        blurSelect() // select all countriesEast / countriesWest
      } else {
        formState.continents = []
        blurSelect() // clear all countriesEast / countriesWest
      }
    }

    const blurSelect = async () => {
      // get the countries from continent
      const { data } = await http.get(VITE_API_URL + '/api/custom-app/cascade/countries?continents=' + formState.continents.join(','))
      formState.countriesEastList = data.countriesEastList // update from filteered masterlist in db
      formState.countriesWestList = data.countriesWestList // update from filteered masterlist in db
      formState.countriesWest = formState.countriesWestList.filter((x) => formState.countriesWest.includes(x)) // intersection
      formState.countriesEast = formState.countriesEastList.filter((x) => formState.countriesEast.includes(x)) // intersection
      blurSelect2()
    }

    const blurSelect2 = async () => {
      const { data } = await http.get(VITE_API_URL + '/api/custom-app/cascade/states?countries=' + formState.countriesWest.join(','))
      formState.westCountryStatesList = data // update from filteered masterlist in db
      formState.westCountryStates = formState.westCountryStatesList.filter((x) => formState.westCountryStates.includes(x)) // intersection
    }

    const onSubmit = async () => {
      console.log('submit!', toRaw(formState))
    }

    return {
      labelCol: { span: 4 }, // form
      wrapperCol: { span: 14 },
      formState,
      onSubmit,
      blurSelect,
      blurSelect2,
      onCheckAllChange
    }
  }
}
</script>
