import React, { memo } from 'react'
import { Bar } from 'react-chartjs-2'

function StackChart(props) {
  const { data, barPercentage } = props

  if (!data) return null

  const labels = Object.keys(data.data)

  return (
    <Bar
      data={{
        labels: data.labels,
        datasets: labels.map((label, i) => {
          return {
            label,
            data: data.data[label],
            backgroundColor: data.backgroundColor[i],
            barPercentage
          }
        })
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,

        // indexAxis: 'y',
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { font: { size: 11 }, maxRotation: 0 },
            grid: { drawOnChartArea: false }
          },
          y: { stacked: true, grid: { drawOnChartArea: false } }
        }
      }}
    />
  )
}

export default memo(StackChart)
