<template>
  <a-form layout="vertical" :model="formState" ref="formRef">
    <a-form-item label="Continents">
      <a-checkbox @change="onCheckAllChange">Select all</a-checkbox>
      <!-- v-model:checked="checkAll" -->
      <a-select
        mode="multiple"
        placeholder="Please select"
        v-model:value="formState.continents"
        @blur="blurSelect"
        @deselect="blurSelect"
      >
        <template #clearIcon> <setting-outlined /> </template>
        <a-select-option v-for="item in lists.continentsList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Countries East Hemisphere">
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.countriesEast" allow-clear>
        <a-select-option v-for="item in lists.countriesEastList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Countries West Hemisphere">
      <a-select
        mode="multiple"
        placeholder="Please select"
        v-model:value="formState.countriesWest"
        allow-clear
        @blur="blurSelect2"
        @deselect="blurSelect2"
      >
        <a-select-option v-for="item in lists.countriesWestList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Country States (West)">
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.westCountryStates">
        <a-select-option v-for="item in lists.westCountryStatesList" :key="item">{{ item }}</a-select-option>
      </a-select>
    </a-form-item>

    <!-- Lpoked -->
    <a-form-item label="Force Include">
      <a-checkbox @change="onCheckAllChangeIncludes">Select all</a-checkbox>
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.forceIncludes">
        <a-select-option v-for="item in forceListFiltered" :key="item" :value="item"> {{ item }} </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Force Exclude">
      <a-checkbox @change="onCheckAllChangeExcludes">Select all</a-checkbox>
      <a-select mode="multiple" placeholder="Please select" v-model:value="formState.forceExcludes">
        <a-select-option v-for="item in forceListFiltered" :key="item" :value="item"> {{ item }} </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="onSubmit">Run</a-button>
      <!-- <input type="reset" value="reset"> -->
      <a-button style="margin-left: 8px" type="primary" @click="onClear">Clear</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue';

onMounted(async () => {});
const formRef = ref();
const lists = reactive({
  continentsList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],

  countriesEastList: [],
  countriesEastMasterList: {
    Asia: ['Russia', 'Japan', 'Burma', 'Indonesia', 'Afghanistan'],
    Europe: ['Russia', 'Germany', 'France', 'Poland', 'Sweden', 'Italy'],
    Africa: ['Egypt', 'Nigeria', 'Kenya', 'Liberia'],
    ME: ['Egypt', 'Saudi Arabia', 'Afghanistan'],
  },

  countriesWestList: [],
  countriesWestMasterList: {
    NA: ['United States', 'Canada'],
    SA: ['Brazil', 'Argentina', 'Ecuador'],
  },

  westCountryStatesList: [],
  westCountryStatesMasterList: {
    'United States': ['California', 'New York', 'Ohio', 'Utah', 'Texas'],
    Canada: ['Ontario', 'Quebec', 'BC', 'Alberta'],
    Brazil: ['B1', 'B2'],
    Argentina: ['A1', 'A2', 'A3'],
    Ecuador: ['EC1', 'EC2'],
  },
});

const formState = reactive({
  // form
  forceIncludes: [],
  forceExcludes: [],
  continents: [],
  countriesEast: [],
  countriesWest: [],
  westCountryStates: [],
});

const onCheckAllChange = e => {
  if (e.target.checked === true) {
    formState.continents = [...lists.continentsList];
    blurSelect(); // select all countriesEast / countriesWest
  } else {
    formState.continents = [];
    blurSelect(); // clear all countriesEast / countriesWest
  }
};

const blurSelect = () => {
  // console.log('blurSelect!', toRaw(formState));
  const key = 'continents';
  const subs = [
    {
      subKey: 'countriesEast',
      subKeyMasterList: 'countriesEastMasterList',
      subKeyList: 'countriesEastList',
    },
    {
      subKey: 'countriesWest',
      subKeyMasterList: 'countriesWestMasterList',
      subKeyList: 'countriesWestList',
    },
    // can add more...
  ];
  for (let sub of subs) {
    // all dropdowns affected
    const { subKey, subKeyMasterList, subKeyList } = sub;
    const keys = {};
    const list = [];
    const newSelected = [];
    for (let _item of formState[key]) {
      // loop continent from continents
      if (lists[subKeyMasterList][_item]) {
        for (let _subItem of lists[subKeyMasterList][_item]) {
          // loop through every country in a continent
          if (!keys[_subItem]) {
            list.push(_subItem);
            keys[_subItem] = true;
            const found = formState[subKey].find(item => item === _subItem);
            if (found) newSelected.push(found);
          }
        }
      }
    }
    formState[subKey] = [...newSelected];
    lists[subKeyList] = [...list];
  }
  blurSelect2();
};

const blurSelect2 = () => {
  // console.log('blurSelect!', toRaw(formState));
  const key = 'countriesWest';
  const subs = [
    {
      subKey: 'westCountryStates',
      subKeyMasterList: 'westCountryStatesMasterList',
      subKeyList: 'westCountryStatesList',
    },
  ];
  for (let sub of subs) {
    // all dropdowns affected
    const { subKey, subKeyMasterList, subKeyList } = sub;
    const keys = {};
    const list = [];
    const newSelected = [];
    for (let _item of formState[key]) {
      // loop country from list of countries
      if (lists[subKeyMasterList][_item]) {
        // start
        for (let _subItem of lists[subKeyMasterList][_item]) {
          // loop through every state in a country
          if (!keys[_subItem]) {
            list.push(_subItem);
            keys[_subItem] = true;
            const found = formState[subKey].find(item => item === _subItem);
            if (found) newSelected.push(found);
          }
        }
        // end
      }
    }
    formState[subKey] = [...newSelected];
    lists[subKeyList] = [...list];
  }
};

const forceListFiltered = computed(() =>
  forceList.filter(o => !formState.forceIncludes.includes(o) && !formState.forceExcludes.includes(o)),
);
const forceList = ['aa1', 'aa22', 'aa23', 'aa4', 'aa5', 'bb1', 'bb22', 'bb23', 'bb4', 'bb5'];

const onCheckAllChangeIncludes = e => {
  if (e.target.checked) {
    formState.forceIncludes = [
      ...formState.forceIncludes,
      ...forceList.filter(o => !formState.forceIncludes.includes(o) && !formState.forceExcludes.includes(o)),
    ];
  } else {
    formState.forceIncludes = [];
  }
};

const onCheckAllChangeExcludes = e => {
  if (e.target.checked) {
  } else {
    formState.forceExlcudes = [];
  }
};

const onSubmit = async () => {
  console.log('submit!', toRaw(formState));
};

const labelCol = {
  // form
  span: 4,
};

const wrapperCol = {
  span: 14,
};

// :tip-formatter="formatter"
// const formatter = value => {
//   return `${value}%`;
// }

const onClear = () => {
  // formRef.value.resetFields() //  does not work
  formState.forceIncludes = [];
  formState.forceExcludes = [];
  formState.continents = [];
  formState.countriesEast = [];
  formState.countriesWest = [];
  formState.westCountryStates = [];
};
</script>
