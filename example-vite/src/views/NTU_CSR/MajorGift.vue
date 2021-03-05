<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Parameters">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Job name">
          <a-input v-model:value="formState.jobName" />
        </a-form-item>

        <a-form-item label="Type">
          <a-radio-group v-model:value="formState.type">
            <a-radio value="single">Single</a-radio>
            <a-radio value="totalOverPeriod">Total Over Period</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Period In Years" extra="(ignored for Single type)">
          <a-radio-group v-model:value="formState.period" :disabled="formState.type === 'single'">
            <a-radio value="3">3</a-radio>
            <a-radio value="5">5</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Amount">
          <a-input-number
            v-model:value="formState.amount"
            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-form-item>

        <a-form-item label="Alumni">
          <a-radio-group v-model:value="formState.alumni">
            <a-radio value="Alumni">Alumni</a-radio>
            <a-radio value="NonAlumni">Non Alumni</a-radio>
            <a-radio value="All">All</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Staff">
          <a-radio-group v-model:value="formState.staff">
            <a-radio value="Staff">Staff</a-radio>
            <a-radio value="NonStaff">Non Staff</a-radio>
            <a-radio value="All">All</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Donor">
          <a-radio-group v-model:value="formState.donor">
            <a-radio value="Donor">Donor</a-radio>
            <a-radio value="NonDonor">Non Donor</a-radio>
            <a-radio value="All">All</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Activity Date">
          <a-date-picker
            v-model:value="formState.activityDate"
            :show-time="false"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
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

        <a-form-item label="Max Sample" extra="Target sample size (1 - 30)">
          <a-input-number
            :min="1" :max="30" :precision="0" :step="1"
            v-model:value="formState.targetSampleSizeMax"
          />
        </a-form-item>

        <a-form-item :label="`Target Balancing`" :extra="'Value: ' + formState.targetSampleBalancing">
          <a-slider v-model:value="formState.targetSampleBalancing" :min="0.0" :max="0.5" :step="0.01" tooltipPlacement="top" />
        </a-form-item>

        <a-form-item label="Force Include">
          <a-checkbox @change="onCheckAllChangeIncludes">Select all</a-checkbox>
          <a-select
            mode="multiple"
            placeholder="Please select"
            v-model:value="formState.forceIncludes"
          >
            <a-select-option v-for="item in forceListFiltered" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Force Exclude">
          <a-checkbox @change="onCheckAllChangeExcludes">Select all</a-checkbox>
          <a-select
            mode="multiple"
            placeholder="Please select"
            v-model:value="formState.forceExcludes"
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
export default {
  setup() {
    const activeKey = ref(['1']) // accordian
    watch(activeKey, val => console.log('watch activeKey', val))

    const formState = reactive({ // form
      jobName: '',
      type: 'single',
      period: '',
      amount: 0,
      activityDate: null,
      db: 'NTUPortal.db',
      alumni: '',
      staff: '',
      donor: '',
      targetSampleSizeMax: 1,
      targetSampleBalancing: 0.0,

      forceIncludes: [],
      forceExcludes: [],
    })

    const forceListFiltered = computed(
      () => forceList.filter(o => !formState.forceIncludes.includes(o) && !formState.forceExcludes.includes(o))
    )
    const forceList = ['aa1', 'aa22', 'aa23', 'aa4', 'aa5', 'bb1', 'bb22', 'bb23', 'bb4', 'bb5']

    const onCheckAllChangeIncludes = e => {
      if (e.target.checked) {
        formState.forceIncludes = [...formState.forceIncludes, ...forceList.filter(o => !formState.forceIncludes.includes(o) && !formState.forceExcludes.includes(o))]
      } else {
        formState.forceIncludes = []
      }
    }
    const onCheckAllChangeExcludes = e => {
      if (!e.target.checked) {
        console.log('tbd')
      } else {
        console.log('tbd')        
      }      
    }

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

      onCheckAllChangeIncludes,
      onCheckAllChangeExcludes,
      // :tip-formatter="formatter"
      // const formatter = value => {
      //   return `${value}%`;
      // }
    }
  },
}
</script>
