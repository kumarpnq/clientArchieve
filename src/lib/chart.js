'use client'
import { Chart as ChartJS, registerables } from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Register Chart.js components globally
ChartJS.register(...registerables, ChartDataLabels) //

const { plugins, datasets, animation } = ChartJS.defaults
plugins.legend = {
  ...plugins.legend,
  align: 'end',
  fullSize: true
}

plugins.legend.labels = {
  ...plugins.legend.labels,
  boxWidth: 10,
  boxHeight: 10,
  usePointStyle: true,
  padding: 15,
  pointStyle: 'circle'
}

plugins.datalabels.display = false

animation.delay = 500

datasets.bar.borderRadius = 6
