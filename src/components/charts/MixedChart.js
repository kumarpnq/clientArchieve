import React, { memo } from 'react'
import { Chart } from 'react-chartjs-2'

let delayed = false
const barColors = ['#08c1d6', '#3366ef']
const lineColors = ['#5b9afd', '#3366ef']

function MixedChart(props) {
  const { metrics, ...rest } = props

  // const labels = Object.keys(data.data)

  const legendMargin = {
    id: 'legendMargin',
    beforeInit(chart) {
      const fitValue = chart.legend.fit

      chart.legend.fit = function () {
        fitValue.bind(chart.legend)()

        return (this.height += 24)
      }
    }
  }

  return (
    <Chart
      plugins={[legendMargin]}
      data={{
        labels: metrics.labels,
        datasets: [
          ...Object.keys(metrics.line).map((label, i) => ({
            type: 'line',
            label: 'QE',
            data: metrics.line[label],
            yAxisID: 'y1',
            backgroundColor: lineColors[i],
            borderColor: lineColors[i],
            borderWidth: 1,
            borderDash: [5, 5],
            datalabels: {
              display: 'auto',
              align: 'top',
              anchor: 'end',
              clamp: true
            }
          })),
          ...Object.keys(metrics.bar).map((label, i) => {
            return {
              type: 'bar',
              label,
              data: metrics.bar[label],
              backgroundColor: barColors[i],
              yAxisID: 'y',
              barPercentage: 0.3,
              borderRadius: 8,
              datalabels: {
                display: true,
                anchor: 'end',
                align: 'top',
                clamp: true,
                rotation: -90
              },
              animation: {
                onComplete: () => {
                  delayed = true
                },
                delay: context => {
                  let delay = 0
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100
                  }

                  return delay
                }
              }
            }
          })
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        hoverRadius: 5,
        hitRadius: 10,
        animation: {
          delay: 1000
        },

        layout: {
          padding: {
            bottom: 35
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              font: { size: 10 },
              callback: function (label) {
                const labels = metrics.labels
                if (/\s/.test(labels[label])) {
                  return labels[label].split(' ').slice(0, 2)
                } else {
                  return labels[label]
                }
              }
            },
            grid: {
              drawOnChartArea: false
            }
          },
          y: {
            ticks: {},
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

export default memo(MixedChart)
