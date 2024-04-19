import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'

import { Line, Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'

Chart.register(...registerables)

const PublicationVisibility = props => {
  const [activeChart, setActiveChart] = useState('Line')

  const { chartData, loading, error, primary, yellow, warning, info, grey, green, legendColor } = props

  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length)

    return backgroundColors[randomIndex]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  }

  const data = {
    labels: chartData.map(data => data.publicationGroupName.substring(0, 15)),
    datasets: [
      {
        label: 'vScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.vScore)
      },
      {
        label: 'iScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.iScore)
      },
      {
        label: 'QE',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.QE)
      }
    ]
  }

  // modal
  const [isChartClicked, setIsChartClicked] = useState(false)

  const handleChartClick = () => {
    setIsChartClicked(true)
  }

  const handleModalClose = () => {
    setIsChartClicked(false)
  }

  return (
    <>
      <Dialog open={isChartClicked} onClose={handleModalClose} maxWidth='lg' fullWidth>
        <Card>
          <CardHeader
            title='Publication Visibility'
            action={
              <IconButton onClick={handleModalClose} sx={{ color: 'primary.main' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            {activeChart === 'Bar' && <Bar data={data} height={500} options={options} />}
            {activeChart === 'Line' && <Line data={data} height={500} options={options} />}
          </CardContent>
        </Card>
      </Dialog>
      <Card>
        <CardHeader
          title='Publication
         Visibility'
          action={
            <Box>
              <IconButton
                onClick={() => setActiveChart('Bar')}
                sx={{
                  backgroundColor: activeChart === 'Bar' ? 'primary.main' : '',
                  color: activeChart === 'Bar' ? 'inherit' : 'primary.main'
                }}
              >
                <IconifyIcon icon='et:bargraph' />
              </IconButton>
              <IconButton
                onClick={() => setActiveChart('Line')}
                sx={{
                  backgroundColor: activeChart === 'Line' ? 'primary.main' : '',
                  color: activeChart === 'Line' ? 'inherit' : 'primary.main'
                }}
              >
                <IconifyIcon icon='et:linegraph' />
              </IconButton>
            </Box>
          }
        />
        <CardContent onClick={handleChartClick}>
          {loading ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeChart === 'Bar' && <Bar data={data} height={325} options={options} />}
              {activeChart === 'Line' && <Line data={data} height={325} options={options} />}
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default PublicationVisibility
