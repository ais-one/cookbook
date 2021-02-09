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

        <a-form-item label="Period In Years (ignored for Single type)">
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

        <a-form-item label="Max Target Sample Size">
          <a-input-number
            :min="1" :max="1" :precision="0" :step="1"
            v-model:value="formState.targetSampleSizeMax"
          />
        </a-form-item>

        <a-form-item :label="`Target Balancing`">
          <a-slider v-model:value="formState.targetSampleBalancing" :min="0.0" :max="0.5" :step="0.01" tooltipPlacement="top" />
          Balancing Value: {{formState.targetSampleBalancing}}
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">Run</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Results" :disabled="false">
    </a-collapse-panel>
  </a-collapse>

</template>
<script>
import { ref, reactive, toRaw, watch, onMounted } from 'vue';
export default {
  setup() {
    onMounted(() => {
    });

    const activeKey = ref(['1']) // accordian
    watch(activeKey, val => { })


    const formState = reactive({ // form
      jobName: '',
      type: 'single',
      period: '',
      amount: 0,
      activityDate: undefined,
      alumni: '',
      staff: '',
      donor: '',
      targetSampleSizeMax: 1,
      targetSampleBalancing: 0.0,

      type: []
    })

    const onSubmit = () => {
      console.log('submit!', toRaw(formState));
    };

    return {
      activeKey, // collapse

      labelCol: { // form
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
      onSubmit,

      // :tip-formatter="formatter"
      // const formatter = value => {
      //   return `${value}%`;
      // }
    }
  },
}
</script>
