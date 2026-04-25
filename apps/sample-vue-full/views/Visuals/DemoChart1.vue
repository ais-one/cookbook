<template>
  <canvas id="id-chart"></canvas>
</template>

<script setup>
import Chart from 'chart.js/auto';
import { onMounted, reactive } from 'vue';

let chart = null;

const data = reactive({
  labels: ['January', 'February', 'March'],
  data0: [40, 20, 12],
});

// const options = reactive({ responsive: true })

onMounted(async () => {
  const chartElId = document.getElementById('id-chart');
  if (!chart && chartElId) {
    chart = new Chart(chartElId, {
      type: 'bar', // 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Reading',
            barThickness: 1,
            maxBarThickness: 1,
            data: data.data0,
          },
        ],
      },
    });
  } else {
    // update chart table and data
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.data0;
    chart.update();
  }
});

// watch(
//   () => chartStore.c2data, //  better not to watch deep...
//   (currentValue, oldValue) => if (chart2) chart2.render(),
//   { deep: true }
// )
</script>
