<template>
  <div>
    [<router-link to="/">Home</router-link>] [<router-link to="/site-a">Site A</router-link>]
    <h1>Site B</h1>
    <div id="viz"></div>
    <div class="edit">
      <textarea v-model="def"></textarea>
    </div>
  </div>
</template>

<script>
// https://vega.github.io/vega/usage/

import * as echarts from 'echarts/lib/echarts'
// import * as Echarts from 'vue-echarts'
console.log('zzzz', echarts)

import embed from 'vega-embed'
import * as vega from 'vega'

// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/polar'

export default {
  name: 'SiteB',
  // async mounted(){
  //   await embed('#viz', this.def, {actions:false})
  // },
  data(){
    let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }

    return{
      def: null,

      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }

    }
  },
  watch:{
    def(v){
      if(v) this.draw()
    }
  },
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

/*
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
vegaEmbed('#viz', vlSpec).then(function (res) {
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
});
*/
</script>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
