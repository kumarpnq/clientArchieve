import React, { memo } from 'react'
import { Doughnut } from 'react-chartjs-2'

function DoughnutChart(props) {
  const { data, cutout, radius, labels } = props

  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#fc8166', '#fbd059', '#58d8ff', '#5d87fd', '#57c0bd', '#8acd82', '#2f839e'],
            borderWidth: 10,
            borderRadius: {
              outerStart: 10,
              outerEnd: 10,
              innerStart: 10,
              innerEnd: 10
            },
            barThickness: 26
          }
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout,
        radius,
        layout: {
          autoPadding: true
        },

        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          }
        }
      }}
    />
  )
}

export default memo(DoughnutChart)
