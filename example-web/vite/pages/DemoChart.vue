<template>
  <div class="container">
    <h1>Site B - For Chart Testing Purposes - Vega / ECharts</h1>
    <div id="main" style="width: 600px;height:400px;"></div>
    <div id="viz"></div>
    <div class="edit">
      <textarea v-model="def"></textarea>
    </div>
  </div>
</template>

<script>
// https://vega.github.io/vega/usage/
// import embed from 'vega-embed'
// import * as vega from 'vega'

import echarts from 'echarts'
console.log(echarts)

export default {
  name: 'SiteB',
  async mounted() {
    // await embed('#viz', 'https://vega.github.io/vega/examples/bar-chart.vg.json', {actions:false})

    // echarts
    var myChart = echarts.init(document.getElementById('main'))
    // specify chart configuration item and data
    var option = {
        title: {
            text: 'ECharts entry example'
        },
        tooltip: {},
        legend: {
            data:['Sales']
        },
        xAxis: {
            data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
        },
        yAxis: {},
        series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    }
    // use configuration item and data specified to show chart
    myChart.setOption(option)
  },
  data(){
    return{
      def: null,
    }
  },
  // watch:{
  //   def(v){
  //     if(v) this.draw()
  //   }
  // },
  methods:{
    async draw(){
      // let def = JSON.parse(this.def)
      // def.width = 'container'
      // def.height = 'container'
      // const xx = await embed('#viz', 'https://vega.github.io/vega/examples/bar-chart.vg.json', {actions:false})
      // console.log('xx', xx)

      const vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        data: {name: 'table'},
        width: 400,
        mark: 'line',
        encoding: {
          x: {field: 'x', type: 'quantitative', scale: {zero: false}},
          y: {field: 'y', type: 'quantitative'},
          color: {field: 'category', type: 'nominal'}
        }
      }
      embed('#viz', vlSpec).then(function (res) {
        // Generates a new tuple with random walk.
        function newGenerator() {
          var counter = -1;
          var previousY = [5, 5, 5, 5];
          return function () {
            counter++;
            var newVals = previousY.map(function (v, c) {
              return {
                x: counter,
                y: v + Math.round(Math.random() * 10 - c * 3),
                category: c
              };
            });
            previousY = newVals.map(function (v) {
              return v.y;
            });
            return newVals;
          };
        }

        var valueGenerator = newGenerator();
        var minimumX = -100;
        window.setInterval(function () {
          minimumX++;
          var changeSet = vega
            .changeset()
            .insert(valueGenerator())
            .remove(function (t) {
              return t.x < minimumX;
            });
          res.view.change('table', changeSet).run();
        }, 1000);
      })
    }
  }
}
</script>

<style>
</style>
