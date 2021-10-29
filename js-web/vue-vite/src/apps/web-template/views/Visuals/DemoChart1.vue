<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="Submit Button" force-render>
      <a-button @click="showC2">Show Chart 2</a-button>
      <h4>Slide to adjust Chart 2 strategy value (80 - 250)</h4>
      <a-slider v-model:value="yValue" :min="80" :max="250" :step="10" @after-change="afterChange" />
    </a-collapse-panel>
    <a-collapse-panel key="2" header="Chart 1" force-render>
      <div style="text-align: center;">
        <h2>Plot of circular stuff</h2>
        <div id="c1"></div>
        <a-divider />
        <h2>Show Nothing Here</h2>
        <a-empty :image-style="{ height: '400px' }" description="Not Enough Data To Generate Chart" />
      </div>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="Chart 2" force-render>
      <a-tabs v-model:activeKey="tabActiveKey">
        <a-tab-pane key="1" tab="Somthing">Hello</a-tab-pane>
        <a-tab-pane key="2" tab="Chart" force-render>
          <div id="c2"></div>
        </a-tab-pane>
      </a-tabs>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
import { useChartPiniaStore } from '../../store.js'
import { onMounted, ref, watch } from 'vue'

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 }
]

export default {
  name: 'DemoChart1',
  setup() {
    const activeKey = ref(['1'])
    const tabActiveKey = ref('1')
    const yValue = ref(100)

    const chartStore = useChartPiniaStore()

    onMounted(() => {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/flare.json')
        .then((res) => res.json())
        .then((data) => {
          const dv = new DataSet.View().source(data, {
            type: 'hierarchy'
          })
          dv.transform({
            type: 'hierarchy.circle-packing'
          })
          const diameter = Math.min(window.innerWidth, 500)
          // console.log('diameter', diameter, window.innerWidth)

          const chart = new Chart({
            container: 'c1',
            height: diameter,
            width: diameter,
            padding: 0
          })
          chart.axis(false)
          chart.legend(false)
          chart.tooltip({ showTitle: false, showMarkers: false })

          const nodes = dv.getAllNodes().map((node) => ({
            hasChildren: !!(node.data.children && node.data.children.length),
            name: node.data.name.split(/(?=[A-Z][^A-Z])/g).join('\n'),
            value: node.value,
            depth: node.depth,
            x: node.x,
            y: node.y,
            r: node.r
          }))

          chart.data(nodes)
          chart.scale({ x: { nice: true }, y: { nice: true } })
          chart
            .point()
            .position('x*y')
            .color('hasChildren')
            .shape('circle')
            .tooltip('name')
            .size('r', (r) => r * diameter)
            .color('r', 'rgb(252, 253, 191)-rgb(231, 82, 99)-rgb(183, 55, 121)')
            .style({
              stroke: 'rgb(183, 55, 121)'
            })
            .label('name', {
              offset: 0,
              style: { textBaseline: 'middle', fill: 'grey', fontSize: 9, textAlign: 'center' },
              layout: { type: 'fixed-overlap' }
            })
          chart.interaction('element-active')
          chart.render()
        })
    })

    let chart2

    const showC2 = () => {
      document.querySelector('#c2').innerHTML = '' //  clear content
      activeKey.value = [...activeKey.value, '3']
      tabActiveKey.value = '2'
      chart2 = new Chart({
        container: 'c2', // specify the chart container ID
        height: 500, // specify the chart height
        forceFit: true,
        autoFit: true
      })
      chart2.data(chartStore.c2data)
      chart2.interval().position('genre*sold')
      chart2.render()

      const e = document.createEvent('Event') // create and send a resize event
      e.initEvent('resize', true, true)
      window.dispatchEvent(e)
    }

    const afterChange = (value) => {
      const temp = [...chartStore.c2data]
      temp[1].sold = yValue.value
      chartStore.c2data = [...temp]
      chart2.render() // rerender here...
    }

    // watch(
    //   () => chartStore.c2data, //  better not to watch deep...
    //   (currentValue, oldValue) => {
    //     if (chart2) chart2.render()
    //   },
    //   { deep: true }
    // )

    return {
      activeKey,
      tabActiveKey,
      showC2,
      afterChange,
      yValue
    }
  }
}
</script>
