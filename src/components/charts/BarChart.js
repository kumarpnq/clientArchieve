import useCustomTooltip from 'src/hooks/useCustomTooltip'
import React, { memo, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { selectUserData } from 'src/store/apps/user/userSlice'

const backgroundColor = ['#3e8ef1', '#75b5f6', '#badbfa']
const clientColor = ['#7367F0', '#b2a6fc']

function BarChart(props) {
  const { metrics, id, ...rest } = props
  const customTooltip = useCustomTooltip()
  const { clientList } = useSelector(selectUserData)
  const clientCompanyName = useMemo(() => clientList[0]?.priorityCompanyName ?? '', [clientList])
  const companyIndex = useMemo(() => metrics.labels.indexOf(clientCompanyName), [metrics.labels, clientCompanyName])

  if (!metrics) return null

  return (
    <Bar
      id={id}
      data={{
        labels: metrics.labels,
        datasets: [
          ...Object.keys(metrics.bar).map((label, i) => ({
            label,
            data: metrics.bar[label],
            backgroundColor: Array.from({ length: metrics.labels.length }, (_, index) =>
              index === companyIndex ? clientColor[i] : backgroundColor[i]
            ),

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

                return /\s/.test(labels[label]) ? labels[label]?.split(' ')?.at(0) : labels[label]
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
