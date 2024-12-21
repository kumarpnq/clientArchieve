import useCustomTooltip from 'src/hooks/useCustomTooltip'
import React, { memo } from 'react'
import { Line } from 'react-chartjs-2'

function LineChart(props) {
  const { data } = props
  const customTooltip = useCustomTooltip()

  if (!data) return null

  const labels = Object.keys(data.data)

  return (
    <Line
      data={{
        labels: data.labels,
        datasets: labels.map((label, i) => ({
          label,
          data: data.data[label],
          borderWidth: 2,
          backgroundColor: data.backgroundColor[i],
          borderColor: data.backgroundColor[i],
          datalabels: {
            display: i === 0 ? true : 'auto'
          }
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
            // display: context => {
            //     // Only display if the value is above a certain threshold
            //     console.log(context);
            //     const datasetIndex = context.datasetIndex;
            //     const dataIndex = context.dataIndex;
            //     const value = context.dataset.data[dataIndex];
            //     return value > 5; // Example condition
            // },
            anchor: 'end',
            align: 'end',
            clamp: true,
            clip: true
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

export default memo(LineChart)
