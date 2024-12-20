import React, { useMemo } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'] // Bar colors

const CombinedBarChart = props => {
  const { metrics } = props

  const labels = useMemo(
    () => Array.from({ length: metrics.labelGroup.length }, () => metrics.labels.map(v => v)).flat(),
    [metrics.labels, metrics.labelGroup]
  )

  const legendMargin = {
    id: 'legendMargin',
    beforeInit(chart) {
      const fitValue = chart.legend.fit
      chart.legend.fit = function () {
        fitValue.bind(chart.legend)()

        return (this.height += 16)
      }
    }
  }

  const customScale = {
    id: 'customScale',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, data, scales } = chart
      const { bottom, width, left, right } = chartArea
      const { x, y } = scales
      const dataPointsLength = metrics.labelGroup.length
      const segment = width / dataPointsLength
      const segmentCenter = segment / 2
      const paddingBottom = bottom + 80
      const labelGroup = data.datasets[1].labelGroup

      // Ensure context is restored to default state
      ctx.restore()
      ctx.save()

      // Set text styling
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'grey'

      // Draw vertical lines
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1

      function createLineStroke(linePoint) {
        const xPos = x.getPixelForValue(linePoint + 0.5)
        ctx.beginPath()
        ctx.moveTo(xPos, bottom)
        ctx.lineTo(xPos, bottom + 70)
        ctx.stroke()
      }

      let linePoint = -1
      createLineStroke(linePoint)
      labelGroup.forEach((_, index) => {
        linePoint = linePoint + metrics.labels.length * (index - index + 1)
        createLineStroke(linePoint)
      })

      // Draw text for label groups
      labelGroup.forEach((region, i) => {
        const xPosition = left + segment * (i + 0.5)
        ctx.fillText(region, xPosition, paddingBottom)

        // ctx.textAlign = 'center'
      })
    }
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        height: '95%'
      }}
    >
      <div
        style={{
          minWidth: `${metrics.labelGroup.length * 400}px`,
          width: '100%',
          height: '100%'
        }}
      >
        <Chart
          id='chart-container'
          plugins={[customScale, legendMargin]}
          type='bar'
          data={{
            labels,
            datasets: [
              ...Object.keys(metrics.line || {}).map(label => ({
                type: 'line',
                label,
                data: metrics.line[label]?.flat(),
                yAxisID: 'y1',
                backgroundColor: ['#5b9afd'],
                borderColor: '#5b9afd',
                borderWidth: 1,
                borderDash: [5, 5],
                datalabels: {
                  display: 'auto',
                  align: 'top',
                  anchor: 'end',
                  clamp: true,
                  rotation: 0
                }
              })),

              ...Object.keys(metrics.bar || {}).map((label, i) => ({
                label,
                data: metrics.bar[label].flatMap(v => v),
                backgroundColor: colors[i % colors.length],
                labelGroup: metrics.labelGroup
              }))
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                display: false,
                callbacks: {
                  label: context => `${context.dataset.label}: ${context.raw}`
                }
              },
              datalabels: {
                display: 'auto',
                anchor: 'end',
                align: 'end',
                font: { size: 10 },
                rotation: -90
              }
            },
            layout: {
              padding: { bottom: 60, top: 0 }
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
                  maxRotation: 90,
                  minRotation: 90,
                  callback: function (label) {
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
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default CombinedBarChart
