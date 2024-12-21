import React, { memo } from 'react'
import { Bar } from 'react-chartjs-2'

function MultiLabelBarChart(props) {
  const { data, categoryPercentage, barPercentage, barThickness } = props
  if (!data) return null
  const labels = Object.keys(data.data)

  const customScale = {
    id: 'customScale',
    afterDatasetsDraw(chart) {
      const { data, ctx, chartArea } = chart
      const { bottom, width } = chartArea
      const dataPointsLength = data.labels.length
      const segment = width / dataPointsLength
      const segmentCenter = segment / 4
      const spacing = 15
      ctx.font = '12px'
      ctx.fillStyle = 'grey'

      // console.log(data.datasets);
      data.datasets.forEach((dataset, index) => {
        const paddingBottom = 20 * (index + 1)
        for (let i = 0; i < data.datasets.length; i++) {
          ctx.textAlign = 'center'
          ctx.borderBottom = true

          // Datapoints
          ctx.fillText(
            data.datasets[index].data[i],
            segment * (i + 1) - segmentCenter,
            bottom + spacing + paddingBottom
          )
        }

        // Companies
        ctx.fillText(data.labels[index], segment * (index + 1) - segmentCenter, bottom + spacing)

        // Labels
        ctx.textAlign = 'left'
        ctx.fillText(dataset.label, 0, bottom + spacing + paddingBottom)
      })
    }
  }

  return (
    <Bar
      plugins={[customScale]}
      data={{
        labels: data.labels,
        datasets: labels.map((label, i) => ({
          label,
          data: data.data[label],
          backgroundColor: data.backgroundColor[i],
          categoryPercentage,
          barPercentage,
          barThickness,
          datalabels: {
            display: true,
            align: 'top',
            color: 'black'
          }
        }))
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false

            // external: customTooltip,
          },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            rotation: -90
          }
        },
        layout: {
          padding: {
            bottom: 180
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { display: false },
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

export default memo(MultiLabelBarChart)
