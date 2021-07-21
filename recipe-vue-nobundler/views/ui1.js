const template = /*html*/`
<div>
  <h1>UI 1</h1>
  <p>Testing BWC UI </p>

  <h3>single autocomplete && string search example</h3>
  <div class="field">
    <label for="" class="label">bwc-combobox - multiple</label>
    <div class="control has-icons-left">
      <bwc-combobox ref="mcRef" :tags="mc.tags" tag-limit="3" multiple input-class="input" listid="multiple-ac" required :items="ac.items" v-model="ac.multipleValue" @search="(e) => autoComplete(e)" @select="selected"></bwc-combobox>
    </div>
  </div>
  <button class="button" @click="setMcTags">setMcTags</button>

  <div class="field">
    <label for="" class="label">bwc-combobox - single</label>
    <div class="control has-icons-left">
      <bwc-combobox listid="single-ac" required :items="ac.items" v-model="ac.singleValue" @search="(e) => autoComplete(e)" @select="selected"></bwc-combobox>
    </div>
  </div>

  <div class="field">
    <label for="" class="label">bwc-autocomplete - Disabled</label>
    <div class="control has-icons-left">
      <bwc-autocomplete disabled listid="single-disabled" required :items="ac.items" v-model="ac.value" @search="(e) => autoComplete(e)" @selected="selected"></bwc-autocomplete>
    </div>
  </div>

  <div class="field">
    <label for="" class="label">bwc-combobox - Search Country</label>
    <div class="control has-icons-left">
      <bwc-combobox object-key="key" object-text="text" listid="country2" required :items="country.items" v-model="country.value" @search="(e) => countrySearch(e)" @select="countrySelected"></bwc-combobox>
    </div>
  </div>

  <div class="field">
    <label for="" class="label">bwc-combobox - Search State (dependent on country)</label>
    <div class="control has-icons-left">
      <bwc-combobox multiple object-key="key" object-text="text" listid="state2" required :items="state.items" :tags="state.tags" @search="(e) => stateSearch(e)" @select="stateSelected"></bwc-combobox>
    </div>
  </div>

  <hr/>

  <h3>File upload</h3>

  <div class="field">
    <label for="" class="label">File Upload 1</label>
    <div class="control">
      <bwc-fileupload input-class="input"></bwc-fileupload>
    </div>
  </div>

  <div class="field">
    <label for="" class="label">File Upload 2 (multiple)</label>
    <div class="control">
      <bwc-fileupload input-class="input" multiple></bwc-fileupload>
    </div>
  </div>

</div>
`

const { onMounted, reactive, ref } = Vue

export default {
  template,
  setup() {
    const mcRef = ref(null)
    const mc = reactive({
      tags: []
    })
    const ac = reactive({
      value: 'aa1',
      items: [], // ['aa9','aa5']

      multipleValue: ['aa1', 'aa2', 'aa1', 'aa3', 'aa4'], // this one becomes a string in v-mode... wrong way to set...
      singleValue: 'aa5'
    })

    const country = reactive({
      value: '',
      items: []
    })
    const state = reactive({
      value: '',
      tags: [],
      items: []
    })

    const list = ['aa1', 'aa15', 'aa16', 'aa17', 'aa18', 'aa19', 'aa20', 'aa21', 'aa22', 'aa23', 'aa24', 'aa25']

    const countryList = [
      { key: 'ae',  text: 'United Arab Emirates'  },
      { key: 'cn',  text: 'China'  },
      { key: 'us',  text: 'United States'  },
      { key: 'sg',  text: 'Singapore'  },
    ]
    const stateList = [
      { key: 'ad',  text: 'Abu Dhabi', parentKey: 'ae' },
      { key: 'db',  text: 'Dubai', parentKey: 'ae' },
      { key: 'fj',  text: 'Fujian', parentKey: 'cn' },
      { key: 'gd',  text: 'Guangdong', parentKey: 'cn' },
      { key: 'gx',  text: 'Guangxi', parentKey: 'cn' },
      { key: 'gz',  text: 'Guizhuo', parentKey: 'cn' },
      { key: 'sx',  text: 'Shanxi', parentKey: 'cn' },
      { key: 'sg',  text: 'Singapore City', parentKey: 'sg' },
      { key: 'al',  text: 'Alabama', parentKey: 'us' },
      { key: 'al',  text: 'Alaska', parentKey: 'us' },
      { key: 'ny',  text: 'New York', parentKey: 'us' },
      { key: 'ca',  text: 'California', parentKey: 'us' },
    ]
    const countryStateList = []

    const autoComplete = (e) => {
      const result = []
      const len = list.length < 8 ? list.length : 8
      for (let i = 0; i < len; i++) {
        if (typeof list[i] === 'string') {
          if (list[i].includes(e.detail)) result.push(list[i])
        } else {
          if (list[i].key.includes(e.detail) || list[i].text.includes(e.detail)) result.push(list[i])
        }
      }
      ac.items = [...result]
    }

    const selected = (e) => {
      console.log('selected event', e.detail)
    }

    const countrySearch = (e) => {
      const result = []
      const search = e.detail.toLowerCase()
      for (let i = 0; i < countryList.length; i++) {
        if (typeof countryList[i] === 'string') {
          if (countryList[i].toLowerCase().includes(search)) result.push(countryList[i])
        } else {
          if (countryList[i].key.toLowerCase().includes(search) || countryList[i].text.toLowerCase().includes(search)) result.push(countryList[i])
        }
      }
      country.items = [...result]
    }
    const countrySelected = (e) => {
      console.log('country selected event', e.detail, country.value)
      // reset state
      state.value = ''
      state.items = []
      state.tags = []

      countryStateList.length = 0
      for (let i = 0; i < stateList.length; i++) {
        if (typeof stateList[i] === 'string') { // can only work on objects
        } else {
          if (e.detail && (stateList[i].parentKey === e.detail.key)) {
            countryStateList.push(stateList[i])
          }
        }
      }
      console.log(countryStateList)
    }

    const stateSearch = (e) => {
      const result = []
      const search = e.detail.toLowerCase()
      for (let i = 0; i < countryStateList.length; i++) {
        if (typeof countryStateList[i] === 'string') {
          if (countryStateList[i].toLowerCase().includes(search)) result.push(countryStateList[i])
        } else {
          if (countryStateList[i].key.toLowerCase().includes(search) || countryStateList[i].text.toLowerCase().includes(search)) result.push(countryStateList[i])
        }
      }
      state.items = [...result]
    }
    const stateSelected = (e) => {
      console.log('state selected event', e.detail, state.value)
    }

    onMounted(async () => {
      console.log('ui1 mounted!')
      console.log('mcRef', mcRef)
      // mc.tags = ['aa1', 'aa2', 'aa1', 'aa3', 'aa4']
    })

    const setMcTags = () => mc.tags = ['aa1', 'aa2', 'aa1', 'aa3', 'aa4']

    return {
      mcRef, // multiSelect
      mc,
      setMcTags,

      ac,
      autoComplete,
      selected,

      country,
      countrySearch,
      countrySelected,

      state,
      stateSearch,
      stateSelected
    }
  }
}
