<template>
  <div>
    <h4>Please Note: the DB Update can take more than 30 minutes</h4>
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" header="Selection">
        <div>
          <a-form :model="formState" layout="vertical">
            <a-form-item label="Select Folder">
              <a-select
                v-model:value="formState.folderName" show-search option-filter-prop="label"
                :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
              >
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="lucy">Lucy</a-select-option>
                <a-select-option value="tom">Tom</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="New Database Name">
              <a-input v-model:value="formState.dbName" />
            </a-form-item>

            <a-form-item>
              <a-collapse>
                <a-collapse-panel key="3" header="Map The Files" :disabled="false">
                  <a-form-item label="Select Appeals Folder /n (should contain lists and theme)">
                    <a-select
                      v-model:value="formState.appealsFolder" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'appeals-'+n" :value="'appeals-'+n">Appeals-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="Select Revenue File">
                    <a-select
                      v-model:value="formState.revenueFile" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'revenue-'+n" :value="'revenue-'+n">Revenue-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="Select Demographics File">
                    <a-select
                      v-model:value="formState.demographicsFile" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'demographics-'+n" :value="'demographics-'+n">Demographics-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="Select Organisations File">
                    <a-select
                      v-model:value="formState.organisationsFile" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'organisations-'+n" :value="'organisations-'+n">Organisations-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="Select Contactability File">
                    <a-select
                      v-model:value="formState.contactabilityFile" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'contactability-'+n" :value="'contactability-'+n">Contactability-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="Select Deceased Identification File">
                    <a-select
                      v-model:value="formState.deceasedFile" show-search option-filter-prop="label" :filter-option="(input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    >
                      <a-select-option v-for="n of 3" :key="'deceased-'+n" :value="'deceased-'+n">Deceased-{{ n }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-collapse-panel>
              </a-collapse>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="onSubmit">Create &amp; Update</a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="Progress" :disabled="false">

      </a-collapse-panel>
    </a-collapse>    
  </div>
</template>
<script>
import { ref, reactive, toRaw, watch, onMounted, computed } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    SettingOutlined,
  },
  setup() {
    onMounted(() => {
    })

    const activeKey = ref(['1'])

    const formState = reactive({ // form
      folderName: '',
      appealsFolder: '',
      revenueFile: '',
      demographicsFile: '',
      organisationsFile: '',
      contactabilityFile: '',
      deceasedFile: '',
      dbName: '',
      themes: [],
      themesList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],
    })

    const onSubmit = () => {
      console.log('submit!', toRaw(formState))
    }

    return {
      activeKey,
      formState,
      onSubmit,
    }
  },
}
</script>
