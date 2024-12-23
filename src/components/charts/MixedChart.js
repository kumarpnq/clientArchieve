import React, { memo, useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { getChartColor } from 'src/store/apps/preference/preferenceSlice'
import { selectUserData } from 'src/store/apps/user/userSlice'

let delayed = false
const barColors = ['#08c1d6', '#3366ef']
const lineColors = ['#5b9afd', '#3366ef']
const clientColor = ['#7367F0', '#b2a6fc']

function MixedChart(props) {
  const { metrics, id, ...rest } = props
  const { clientList } = useSelector(selectUserData)
  const { colors: ChartColors } = useSelector(getChartColor)
  const clientCompanyName = useMemo(() => clientList[0]?.priorityCompanyName ?? '', [clientList])
  const companyIndex = useMemo(() => metrics.labels.indexOf(clientCompanyName), [metrics.labels, clientCompanyName])

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
      id={id}
      plugins={[legendMargin]}
      data={{
        labels: metrics.labels,
        datasets: [
          ...Object.keys(metrics.line).map((label, i) => ({
            type: 'line',
            label,
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
              backgroundColor: Array.from({ length: metrics.labels.length }, (_, index) =>
                index === companyIndex ? clientColor[i] : ChartColors[i]
              ),

              yAxisID: 'y',

              // barThickness: 10,
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
        datasets: {
          bar: {
            maxBarThickness: 9,
            categoryPercentage: 0.6
          }
        },

        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              font: { size: 10 },
              callback: function (label) {
                const labels = metrics.labels

                return /\s/.test(labels[label]) ? labels[label]?.split(' ')?.at(0) : labels[label]
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
            },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,

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
