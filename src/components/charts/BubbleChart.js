import React, { memo } from 'react'
import { Bubble } from 'react-chartjs-2'

function BubbleChart(props) {
  const { data } = props

  if (!data) return null

  const labels = Object.keys(data.data)

  return (
    <Bubble
      data={{
        labels: data.labels,
        datasets: labels.map(label => ({
          label,
          data: data.data[label],
          backgroundColor: ['#fc816675', '#fbd05975', '#58d8ff75', '#5d87fd75', '#57c0bd75', '#8acd8275', '#2f839e75']
        }))
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false
      }}
    />
  )
}

export default memo(BubbleChart)
