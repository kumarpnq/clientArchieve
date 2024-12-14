import React, { memo } from 'react'
import { Bar } from 'react-chartjs-2'

// const barColors = ['#2e5aca', '#91bdf5', '#1f4394']
const barColors = ['#3e8ef1', '#75b5f6', '#badbfa']

function StackChart(props) {
  const { metrics, ...rest } = props

  return (
    <Bar
      data={{
        labels: metrics.labels,
        datasets: [
          ...Object.keys(metrics.stack).map((label, i) => {
            return {
              label,
              data: metrics.stack[label],
              backgroundColor: barColors[i],
              barPercentage: 0.15,
              ...rest
            }
          })
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,

        layout: {
          padding: {
            bottom: 35
          }
        },

        // indexAxis: 'y',
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: { size: 11 },
              maxRotation: 0,

              callback: function (label) {
                const labels = metrics.labels

                return /\s/.test(labels[label]) ? labels[label]?.split(' ')?.at(0) : labels[label]
              }
            },
            grid: { drawOnChartArea: false }
          },
          y: { stacked: true, grid: { drawOnChartArea: false } }
        }
      }}
    />
  )
}

export default memo(StackChart)
