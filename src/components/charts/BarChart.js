import useCustomTooltip from 'src/hooks/useCustomTooltip'
import React, { memo } from 'react'
import { Bar } from 'react-chartjs-2'

const backgroundColor = ['#3e8ef1', '#75b5f6', '#badbfa']

function BarChart(props) {
  const { metrics, ...rest } = props
  const customTooltip = useCustomTooltip()

  if (!metrics) return null

  return (
    <Bar
      data={{
        labels: metrics.labels,
        datasets: [
          ...Object.keys(metrics.bar).map((label, i) => ({
            label,
            data: metrics.bar[label],
            backgroundColor: backgroundColor[i],
            ...rest
          }))
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false,
            external: customTooltip
          },
          datalabels: {
            display: 'auto',
            anchor: 'end',
            align: 'end',
            rotation: -90
          }
        },
        layout: {
          padding: {
            bottom: 35
          }
        },
        datasets: {
          bar: {
            maxBarThickness: 9,
            categoryPercentage: 0.6
          }
        },

        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 },
              callback: function (label) {
                const labels = metrics.labels

                return /\s/.test(labels[label]) ? labels[label].split(' ').slice(0, 2) : labels[label]
              }
            },
            grid: {
              drawOnChartArea: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }}
    />
  )
}

export default memo(BarChart)
