<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Parameters">
      <a-form :model="formState" :wrapper-col="wrapperCol">
        <a-row type="flex" justify="space-around">
          <a-col :md="24" :lg="7">
            <a-form-item label="Select CNN models">
              <a-select mode="multiple" v-model:value="formState.compareCnnModel" style="width: 100%" placeholder="Select models">
                <a-select-option v-for="item in formState.compareCnnModelList" :key="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="7">
            <a-form-item label="Select metrics">
              <a-select mode="multiple" v-model:value="formState.compareCnnModelMetrics" style="width: 100%" placeholder="Select metrics">
                <a-select-option v-for="item in formState.compareCnnModelMetricsList" :key="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="7">
            <a-form-item label="Plot option">
              <a-radio-group v-model:value="formState.compareCnnModelPlotOption">
                <a-radio value="model">Compare by model</a-radio>
                <a-radio value="metric">Compare by metric</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between">
          <a-col :span="3">
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click.native="onSubmit">Initiate training on images</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item>
              <a-button style="margin-left: 10px">Clear Inputs</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        Create Response: {{ submitResult || 'No Response' }}
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Results" :disabled="false">
      <a-tabs v-model:activeKey="tabActiveKey">
        <a-tab-pane key="1" tab="Charts">
          <div id="c1"></div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Table">
          <a-table :columns="columns" :data-source="dataSource" bordered rowKey="bd"></a-table>
        </a-tab-pane>
      </a-tabs>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import { ref, reactive, toRaw, watch, onMounted } from 'vue'
import { Chart } from '@antv/g2'
import { http } from '/src/services.js'
import { VITE_API_URL } from '/config.js'

export default {
  setup() {
    const submitResult = ref('')
    const dataSource = ref([])
    const columns = ref([])

    const activeKey = ref(['1']) // accordian
    watch(activeKey, (val) => {
      console.log(val)
    })
    const tabActiveKey = ref('1')
    const formState = reactive({
      compareCnnModel: [],
      compareCnnModelList: [],
      compareCnnModelMetrics: [],
      compareCnnModelMetricsList: ['train_acc','train_loss','val_acc','val_loss'],
      compareCnnModelPlotOption: undefined,
    })

    onMounted(async () => {
      try {
        const { data } = await http.get(VITE_API_URL + '/api/emerson-app/home/home')
        formState.compareCnnModelList = [...data.cnnModels]
      } catch (e) {
        console.log(e.toString())
      }
    })

    const onSubmit = async () => {
      try {
        // append files and data to formdata
        const json = toRaw(formState)

        dataSource.value = []
        columns.value = []
        const coltmp = []
        const temp = []
        const { data } = await http.post(VITE_API_URL + '/api/emerson-app/model/modelcnn', json)
        console.log(data)
        // columns names
        for (let i=0; i < data.colNames.length; i++) {
          coltmp.push({
            title: data.colNames[i],
            dataIndex: data.colNames[i]
          })
        }
        columns.value = [...coltmp]

        // table data
        const col = data.colNames[0]
        for (let i=0; i < data.params[col].length; i++) {
          const dictTmp = {}
          for (let j=0; j < data.colNames.length; j++) {
            dictTmp[data.colNames[j]] = data.params[data.colNames[j]][i]
          }
          temp.push(dictTmp)
        }
        dataSource.value = [...temp]

        // chart
        // problem: cannot append to nothing. if results tab doesn't open, give error: appendchild to null; if open results tab, then works, no problem with data or chart.
        for (var key in data.chartData) {
          const chartdata = data.chartData[key]
          console.log(key, chartdata)
          // key is model, value is chart data
          const chart = new Chart({
            container: 'c1',
            autoFit: true,
            height: 500
          })
          chart.data(chartdata)
          chart.scale({
            epoch: { range: [0, 1] }
            // value: { nice: true,},
          })
          chart.axis('value', {
            label: {
              formatter: (val) => val * 100 + ' %'
            }
          })
          chart.tooltip({ showCrosshairs: true })
          chart.line().position('epoch*value').color('name').shape('smooth')
          chart.point().position('epoch*value').color('name').shape('circle')
          chart.render()
        }
        submitResult.value = JSON.stringify(data)
      } catch (e) {
        console.log('onSubmit Error', e.toString())
        submitResult.value = e.toString()
      }
    }

    return {
      submitResult,
      activeKey, // form
      tabActiveKey,
      wrapperCol: {
        span: 24,
      },
      formState,
      onSubmit,
      columns,
      dataSource
    }
  }
}
</script>
