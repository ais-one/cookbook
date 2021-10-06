<template>
  <a-form :model="formState" layout="vertical">
    <h1>Store Counter {{ storeCounter }}</h1>
    <a-form-item label="Region">
      <a-select
        mode="multiple"
        placeholder="Please select"
        v-model:value="formState.regions"
        style="width: 300px;"
        @blur="blurRegion"
        @deselect="blurRegion"
      >
        <a-select-option v-for="region in formState.regionList" :key="region">{{ region }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Countries">
      <a-select
        mode="multiple"
        placeholder="Please select"
        v-model:value="formState.countries"
        style="width: 300px;"
      >
        <a-select-option v-for="country in formState.countriesList" :key="country">{{ country }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px">Cancel</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { ref, reactive, toRaw, watch, onMounted, computed } from 'vue'
import { useMainPiniaStore } from '../../store.js'

export default {
  setup() {
    // a-select - allowClear (handle event)
    // TBD select / clear all

    const mainStore = useMainPiniaStore()
    onMounted(() => {})

    const formState = reactive({
      regions: [],
      regionList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],

      countries: [],
      countriesList: [],
      countriesMasterList: {
        Asia: ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
        Europe: ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
        NA: ['United States', 'Canada'],
        SA: ['Brazil', 'Argentina', 'Ecuador'],
        Africa: ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
        ME: ['Egypt', 'Saudi Arabia', 'Afghanistan']
      }
    })

    const onSubmit = () => {
      console.log('submit!', toRaw(formState))
    }

    const blurRegion = () => {
      console.log('blurRegion!', toRaw(formState))
      const keys = {}
      const list = []
      const newCountries = []

      for (const region of formState.regions) {
        for (const country of formState.countriesMasterList[region]) {
          if (!keys[country]) {
            list.push(country)
            keys[country] = true
            const item = formState.countries.find((item) => item === country)
            if (item) {
              newCountries.push(item)
            }
          }
        }
      }
      formState.countries = [...newCountries]
      formState.countriesList = [...list]
    }

    return {
      formState,
      onSubmit,
      blurRegion,
      storeCounter: computed(() => mainStore.counter)
    }
  }
}
</script>
