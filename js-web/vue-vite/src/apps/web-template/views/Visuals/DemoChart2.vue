<template>
  <div>
    <a-descriptions title="Report On ABC and DEF">
      <a-descriptions-item label="UserName">Zhou Maomao</a-descriptions-item>
      <a-descriptions-item label="Telephone">1810000000</a-descriptions-item>
      <a-descriptions-item label="Live">Hangzhou, Zhejiang</a-descriptions-item>
      <a-descriptions-item label="Remark">empty</a-descriptions-item>
      <a-descriptions-item label="Address">No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</a-descriptions-item>
    </a-descriptions>
    <div id="c2"></div>
    <a-divider />
    <a-descriptions title="Another Report On Nobody" bordered>
      <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
      <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
      <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
      <a-descriptions-item label="Order time">2018-04-24 18:00:00</a-descriptions-item>
      <a-descriptions-item label="Usage Time" :span="2">2019-04-24 18:00:00</a-descriptions-item>
      <a-descriptions-item label="Status" :span="3">
        <a-badge status="processing" text="Running" />
      </a-descriptions-item>
      <a-descriptions-item label="Negotiated Amount">$80.00</a-descriptions-item>
      <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
      <a-descriptions-item label="Official Receipts">$60.00</a-descriptions-item>
      <a-descriptions-item label="Config Info">
        Data disk type: MongoDB<br />
        Database version: 3.4<br />
        Package: dds.mongo.mid<br />
        Storage space: 10 GB<br />
        Replication factor: 3<br />
        Region: East China 1<br />
      </a-descriptions-item>
    </a-descriptions>
    <div id="c3"></div>
  </div>
</template>

<script>
import { Scatter, Area } from '@antv/g2plot'
import { onMounted } from 'vue'

export default {
  name: 'DemoChart2',
  setup() {
    onMounted(() => {
      // scatterPlot
      fetch('https://gw.alipayobjects.com/os/bmw-prod/f950b2f1-038b-47c2-afcc-63001bc8d07c.json')
        .then((res) => res.json())
        .then((data) => {
          const processData = data.map((item) => {
            item['Average annual wage'] = item['Average annual wage'] * 1
            item['probability'] = item['probability'] * 1
            item['numbEmployed'] = item['numbEmployed'] * 1
            return item
          })
          const labels = ['Airline Pilots, Copilots and Flight Engineers', 'Benefits Managers']
          const scatterPlot = new Scatter('c2', {
            appendPadding: 30,
            data: processData,
            xField: 'probability',
            yField: 'Average annual wage',
            colorField: 'education',
            size: [2, 16],
            sizeField: 'numbEmployed',
            shape: 'circle',
            yAxis: {
              nice: false,
              min: -20000,
              tickCount: 5,
              position: 'right',
              label: {
                formatter: (value) => {
                  return Math.floor(value / 1000) + 'K'
                }
              },
              grid: {
                line: {
                  style: {
                    stroke: '#eee'
                  }
                }
              },
              line: {
                style: {
                  stroke: '#aaa'
                }
              }
            },
            tooltip: {
              fields: ['probability', 'Average annual wage', 'numbEmployed']
            },
            legend: {
              position: 'top'
            },
            xAxis: {
              min: -0.04,
              max: 1.04,
              nice: false,
              grid: {
                line: {
                  style: {
                    stroke: '#eee'
                  }
                }
              },
              line: false,
              label: false
            },
            label: {
              formatter: (item) => {
                return labels.includes(item['short occupation']) ? item['short occupation'] : ''
              },
              offsetY: -10
            },
            annotations: [
              {
                type: 'line',
                start: [-0.04, 100000],
                end: [1.04, 30000],
                style: {
                  stroke: '#aaa'
                }
              },
              {
                type: 'text',
                position: ['1.03', 'max'],
                content: 'Average annual wage',
                style: {
                  textAlign: 'right',
                  fontWeight: '500',
                  fill: 'rgb(92, 92, 92)'
                }
              },
              {
                type: 'text',
                position: ['1.03', 'min'],
                content: 'Most likely to \nbe automated ',
                style: {
                  textAlign: 'right',
                  fontWeight: '500',
                  fill: 'rgb(92, 92, 92)'
                }
              },
              {
                type: 'text',
                position: ['-0.03', 'min'],
                content: 'Least likely to \nbe automated ',
                style: {
                  textAlign: 'left',
                  fontWeight: '500',
                  fill: 'rgb(92, 92, 92)'
                }
              }
            ]
          })
          scatterPlot.render()
        })

      fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
        .then((res) => res.json())
        .then((data) => {
          const area = new Area('c3', {
            data,
            xField: 'year',
            yField: 'value',
            seriesField: 'category',
            color: ['#6897a7', '#8bc0d6', '#60d7a7', '#dedede', '#fedca9', '#fab36f', '#d96d6f'],
            xAxis: {
              type: 'time',
              mask: 'YYYY'
            },
            yAxis: {
              label: {
                // 数值格式化为千分位
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
              }
            },
            legend: {
              position: 'top'
            }
          })
          area.render()
        })
    }) // onMounted

    return {}
  }
}
</script>
