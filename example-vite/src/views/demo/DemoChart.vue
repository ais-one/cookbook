<template>
  <div class="container">
    <h1>Site B - For Chart Testing Purposes - Vega / ECharts</h1>
    <div id="main" style="width: 600px; height: 400px"></div>
    <div id="viz"></div>
    <div class="edit">
      <textarea v-model="def"></textarea>
    </div>
  </div>
</template>

<script>
// https://vega.github.io/vega/usage/

import * as echarts from 'echarts' // echarts version 5 onwards, es module
// console.log(echarts)

export default {
  name: 'DemoChart',
  data() {
    return {
      def: null
    }
  },
  async mounted() {
    // echarts
    const myChart = echarts.init(document.getElementById('main'))
    // specify chart configuration item and data
    const option = {
      title: {
        text: 'ECharts entry example'
      },
      tooltip: {},
      legend: {
        data: ['Sales']
      },
      xAxis: {
        data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
    // use configuration item and data specified to show chart
    myChart.setOption(option)
  },
  methods: {}
}
</script>
