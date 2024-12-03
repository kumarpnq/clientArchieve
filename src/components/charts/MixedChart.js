import React, { memo, useEffect, useState } from 'react'
import { Chart } from 'react-chartjs-2'

let delayed = false
const colors = ['#08c1d6', '#3366ef']

function MixedChart(props) {
  const data = props.data
  const [metrics, setMetrics] = useState({ labels: [], QE: [], bar: { Visibility: [], Image: [] } })

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

  useEffect(() => {
    const metrics = { labels: [], QE: [], bar: { Visibility: [], Image: [] } }
    data.forEach(d => {
      metrics.labels.push(d.key)
      metrics.QE.push(Math.trunc(d.QE.value) || 0)
      metrics.bar.Visibility.push(Math.trunc(d.V_Score.value) || 0)
      metrics.bar.Image.push(Math.trunc(d.I_Score.value) || 0)
    })

    setMetrics(metrics)
  }, [data])

  if (!data) return null

  return (
    <Chart
      plugins={[legendMargin]}
      data={{
        labels: metrics.labels,
        datasets: [
          {
            type: 'line',
            label: 'QE',
            data: metrics.QE,
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
          ...Object.keys(metrics.bar).map((label, i) => {
            return {
              type: 'bar',
              label,
              data: metrics.bar[label],
              backgroundColor: colors[i],
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

        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              font: { size: 10 },
              callback: function (label) {
                const labels = metrics.labels
                if (/\s/.test(labels[label])) {
                  return labels[label].split(' ')[0]
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
