<template>
  <div style="text-align: center;">
    <h2>Plot of circular stuff</h2>
    <div id="c1"></div>
    <a-divider />
    <h2>Show Nothing Here</h2>
    <a-empty :image-style="{ height: '400px' }" description="Not Enough Data To Generate Chart" />
    <a-divider />
    <h2>Some Bars</h2>
    <div id="c2"></div>
  </div>
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

import { onMounted } from 'vue';

export default {
  name: 'DemoChart1',
  setup() {
    onMounted(() => {
      const chart2 = new Chart({
        container: 'c2', // specify the chart container ID
        width: 600, // specify the chart width
        height: 300, // specify the chart height
      })
      chart2.data(data)
      chart2.interval().position('genre*sold')
      chart2.render()


      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/flare.json')
        .then((res) => res.json())
        .then((data) => {
          const dv = new DataSet.View().source(data, {
            type: 'hierarchy',
          });
          dv.transform({
            type: 'hierarchy.circle-packing',
          });
          const diameter = Math.min(window.innerWidth, 500);

          const chart = new Chart({
            container: 'c1',
            height: diameter,
            width: diameter,
            padding: 0,
          });
          chart.axis(false);
          chart.legend(false);
          chart.tooltip({
            showTitle: false,
            showMarkers: false,
          });

          const nodes = dv.getAllNodes().map((node) => ({
            hasChildren: !!(node.data.children && node.data.children.length),
            name: node.data.name.split(/(?=[A-Z][^A-Z])/g).join('\n'),
            value: node.value,
            depth: node.depth,
            x: node.x,
            y: node.y,
            r: node.r,
          }));

          chart.data(nodes);
          chart.scale({
            x: { nice: true },
            y: { nice: true },
          });
          chart
            .point()
            .position('x*y')
            .color('hasChildren')
            .shape('circle')
            .tooltip('name')
            .size('r', (r) => r * diameter)
            .color('r', 'rgb(252, 253, 191)-rgb(231, 82, 99)-rgb(183, 55, 121)')
            .style({
              stroke: 'rgb(183, 55, 121)',
            })
            .label('name', {
              offset: 0,
              style: {
                textBaseline: 'middle',
                fill: 'grey',
                fontSize: 9,
                textAlign: 'center',
              },
              layout: {
                type: 'fixed-overlap',
              },
            });
          chart.interaction('element-active');

          chart.render();
        });





    })
    return {
    }
  }
}
</script>
