'use client'

import React from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const CombinedBarChart = () => {
  const regions = ['NY', 'Arlington', 'Chicago', 'Detroit', 'LA'] // Regions
  const manufacturers = ['GM', 'FORD', 'HONDA', 'TOYOTA', 'VW'] // Manufacturers
  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'] // Bar colors

  // Production volumes for each region (each row corresponds to a manufacturer)
  const dataValues = [
    [29486, 1546, 3183, 3908, 1799], // GM
    [41108, 10494, 2051, 5183, 3174], // FORD
    [23522, 5541, 3511, 2852, 1024], // HONDA
    [23298, 7224, 1242, 2532, 1244], // TOYOTA
    [27675, 7388, 1970, 264, 1789] // VW
  ]

  const bgcolors = Array.from({ length: regions.length }, (_, i) => colors.map(_ => colors[i]))

  const datasets = [
    {
      type: 'line',
      label: 'QE',
      data: [
        100, 146, 155, 149, 110, 70, 169, 65, 40, 58, 120, 148, 150, 174, 100, 155, 149, 110, 70, 169, 111, 150, 174,
        130, 150
      ],
      yAxisID: 'y1',
      backgroundColor: ['#5b9afd'],
      borderColor: '#5b9afd',
      borderWidth: 1,
      borderDash: [5, 5],
      datalabels: {
        display: 'auto',
        align: 'top',
        anchor: 'end',
        clamp: true
      }
    },
    {
      data: dataValues.flatMap(v => v),
      barPercentage: 0.8,
      categoryPercentage: 0.7,
      backgroundColor: bgcolors.flat()
    },
    {
      data: dataValues.flatMap(v => v),
      barPercentage: 0.8,
      categoryPercentage: 0.7
    }
  ]

  const customScale = {
    id: 'customScale',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart
      const { bottom, width } = chartArea
      const { x, y } = scales
      const dataPointsLength = regions.length
      const segment = width / dataPointsLength
      const segmentCenter = segment / 4 + 15
      const paddingBottom = bottom + 50

      // ctx.save();

      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1
      function createLineStroke(linePoint) {
        const xPos = x.getPixelForValue(linePoint + 0.5)
        ctx.beginPath()
        ctx.moveTo(xPos, bottom)
        ctx.lineTo(xPos, y.bottom + 70)
        ctx.stroke()
      }

      let linePoint = -1
      createLineStroke(linePoint)
      regions.forEach((_, index) => {
        linePoint = linePoint + regions.length * (index - index + 1)
        createLineStroke(linePoint)
      })

      function ctxText(text, x, y) {
        ctx.beginPath()
        ctx.font = 'bold 16px'
        ctx.fillStyle = 'grey'
        ctx.textAlign = 'center'
        ctx.fillText(text, x, y)
      }

      regions.forEach((region, i) => {
        let num = i + 1
        ctxText(region, segment * num - segmentCenter, paddingBottom)
      })
    }
  }

  return (
    <Chart
      plugins={[customScale]}
      type='bar'
      data={{
        labels: Array.from({ length: regions.length }, () => manufacturers.map(v => v)).flat(),
        datasets // All datasets (one per manufacturer)
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top'
          },
          tooltip: {
            display: false,
            callbacks: {
              label: context => `${context.dataset.label}: ${context.raw}`
            }
          }
        },
        layout: {
          padding: { bottom: 30 }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',

            // grid line settings
            grid: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            }
          }
        }
      }}
    />
  )
}

export default CombinedBarChart
