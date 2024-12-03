import useCustomTooltip from 'src/hooks/useCustomTooltip'
import React, { memo } from 'react'
import { Bar } from 'react-chartjs-2'

function BarChart(props) {
  const { data, categoryPercentage, barPercentage, barThickness } = props
  const customTooltip = useCustomTooltip()

  if (!data) return null

  const labels = Object.keys(data.data)

  return (
    <Bar
      data={{
        labels: data.labels,
        datasets: labels.map((label, i) => ({
          label,
          data: data.data[label],
          backgroundColor: data.backgroundColor[i],
          categoryPercentage,
          barPercentage,
          barThickness
        }))
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
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 },
              callback: function (label) {
                const labels = data.labels

                return /\s/.test(labels[label]) ? labels[label].split(' ') : labels[label]
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
