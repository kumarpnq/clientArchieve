import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Line, Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'
import useChartsData from 'src/api/dashboard-analytics/useChartsData'

Chart.register(...registerables)

const VisibilityRanking = props => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeChart, setActiveChart] = useState('Line')
  const [activeMenu, setActiveMenu] = useState('main')
  const [chartLoaded, setChartLoaded] = useState(false)

  const { chartData, loading, error, setMedia, primary, yellow, warning, info, grey, green, legendColor } = props

  useEffect(() => {
    setActiveChart('Line')
    setChartLoaded(true)
  }, [])

  const handleIconClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setActiveMenu('main')
  }

  const handleClose = () => {
    setAnchorEl(null)
    setActiveMenu('main')
  }

  const handleClick = (item, menu) => {
    setActiveChart(item)
    setActiveMenu(menu)
    setAnchorEl(null)
    if (menu === 'media') {
      setMedia({
        ...media,
        visibilityRanking: item.toLowerCase()
      })
    }
  }

  const renderMenuItems = (items, menuType) => {
    return items.map(item => (
      <MenuItem key={item} onClick={() => handleClick(item, menuType)} selected={activeChart === item}>
        {item}
      </MenuItem>
    ))
  }

  const mediaItems = ['Print', 'Online', 'Online&Headline']
  const chartItems = ['Bar', 'Line']

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
          display: false
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
        display: false
      }
    }
  }

  const data = {
    labels: chartData.map(data => data.companyName.substring(0, 15)),
    datasets: [
      {
        label: 'vScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.vScore)
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Visibility Ranking'
        action={
          <Box>
            <IconButton aria-haspopup='true' onClick={handleIconClick}>
              <IconifyIcon icon='tabler:dots-vertical' />
            </IconButton>
            <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
              <MenuItem onClick={() => setActiveMenu('media')}>Media</MenuItem>
              <MenuItem onClick={() => setActiveMenu('chart')}>Chart</MenuItem>
            </Menu>
          </Box>
        }
      />
      <CardContent>
        <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && activeMenu === 'media'}>
          {renderMenuItems(mediaItems, 'media')}
        </Menu>

        <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && activeMenu === 'chart'}>
          {renderMenuItems(chartItems, 'chart')}
        </Menu>

        {loading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeChart === 'Bar' && <Bar data={data} height={325} options={options} />}
            {activeChart === 'Line' && <Line data={data} height={325} options={options} />}{' '}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default VisibilityRanking
