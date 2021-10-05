<template>
  <div style="text-align: center;">
    <div id="mc1"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { Chart } from '@antv/g2'

export default {
  name: 'MultiChart',
  setup() {

  onMounted(() => {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json')
        .then(res => res.json())
        .then(data => {
          const chart = new Chart({
            container: 'mc1',
            autoFit: true,
            height: 500,
            padding: 48,
          });
          chart.data(data);

          chart.scale({
            carat: {
              sync: true
            },
            price: {
              sync: true
            },
            cut: {
              sync: true
            }
          });

          chart.facet('list', {
            fields: [ 'cut' ],
            cols: 3, // 超过3个换行
            padding: 30,
            eachView(view) {
              view.point()
                .position('carat*price')
                .color('cut')
                .shape('circle')
                .style({ fillOpacity: 0.3, stroke: null })
                .size(3);
            }
          });
          chart.render();
        });
    })
    return {
    }
  }

}
</script>
