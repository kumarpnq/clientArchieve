import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'

import { Line, Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'

Chart.register(...registerables)

const SubjectVscore = props => {
  const { chartData, loading, error, setMedia, primary, yellow, warning, info, grey, green, legendColor } = props
  console.log(chartData)

  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length)

    return backgroundColors[randomIndex]
  }
  const labels = []
  const datasets = []

  chartData.forEach((data, dataIndex) => {
    const companyScores = data.companies.map(company => company.vScore)
    const backgroundColor = backgroundColors[dataIndex % backgroundColors.length]

    labels.push(data.reportingSubject)
    datasets.push({
      label: data.reportingSubject,
      data: companyScores,
      backgroundColor: backgroundColor
    })
  })

  const chartOptions = {
    indexAxis: 'x',
    scales: {
      x: {
        stacked: true // Enable stacking for the x-axis
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Subject VScore' />
      <CardContent>
        <Bar data={{ labels, datasets }} options={chartOptions} />
      </CardContent>
    </Card>
  )
}

export default SubjectVscore
