<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="File Upload">
      <file-upload></file-upload>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Job List" force-render>
      <job-list></job-list>
    </a-tab-pane>
  </a-tabs>


</template>
<script>
import { ref, reactive, toRaw } from 'vue';
import FileUpload from './UpdateDb/FileUpload.vue';
import JobList from './UpdateDb/JobList.vue';

export default {
  components: {
    FileUpload,
    JobList,
  },
  setup() {
    const activeKey = ref('1')

    const formState = reactive({ // form
      jobName: '',
      db: 'NTUPortal.db',
      donor: 'Average',
      themes: [],
      themesList: ['Asia', 'Europe', 'NA', 'SA', 'Africa', 'ME'],
    })

    const onSubmit = () => {
      console.log('submit!', toRaw(formState))
    }

    return {
      activeKey, // collapse
      formState,
      onSubmit,
    }
  },
}
</script>
