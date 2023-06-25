<script lang="ts" setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

const props = defineProps({
  chartData: {
    type: Object as any,
    required: true
  },
  options: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <Line class="min-w-[250px] w-[35vw]" :data="props.chartData" :options="props.options" />
</template>