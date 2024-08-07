'use client';
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
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Switch } from '@mui/material'

import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'

Chart.register(...registerables)

// ** third party imports
import { toBlob } from 'html-to-image'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

// ** custom imports
import usePath from 'src/@core/utils/usePath'
import useRemoveChart from 'src/@core/utils/useRemoveChart'
import AddScreen from 'src/custom/AddScreenPopup'
import useRemove from 'src/hooks/useRemoveChart'

// ** redux
import { useSelector } from 'react-redux'
import { userDashboardId } from 'src/store/apps/user/userSlice'

const VisibilityRanking = props => {
  const { currentPath, asPath } = usePath()
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeChart, setActiveChart] = useState('Line')
  const [activeMenu, setActiveMenu] = useState('main')
  const [chartLoaded, setChartLoaded] = useState(false)
  const [activeType, setActiveType] = useState('chart')
  const [chartIndexAxis, setChartIndexAxis] = useState('x')
  const [checked, setChecked] = useState(false)
  const dbId = useSelector(userDashboardId)

  const handleChange = () => {
    setActiveChart('Bar')
    setChecked(prev => !prev)
  }

  const { chartData, loading, error, path, setMedia, primary, yellow, warning, info, grey, green, legendColor } = props

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

  const handleMenuClick = menuItem => {
    switch (menuItem) {
      case 'chart':
        setActiveType('chart')
        break
      case 'table':
        setActiveType('table')
        break
      case 'image':
        toBlob(document.getElementById('visibility-ranking')).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'visibility-ranking.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById('visibility-ranking')).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save('visibility-ranking.pdf')
            URL.revokeObjectURL(url)
          }
          img.src = url
        })
        break
      case 'xlsx':
        if (chartData) {
          const ws = XLSX.utils.json_to_sheet(chartData)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Chart Data')
          XLSX.writeFile(wb, 'visibilityRanking.xlsx')
        }
        break
      default:
        break
    }
    handleClose()
  }

  // const mediaItems = ['Print', 'Online', 'Online&Headline']
  const chartItems = ['Bar', 'Line', 'Pie', 'Doughnut']

  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length)

    return backgroundColors[randomIndex]
  }

  const options = {
    indexAxis: chartIndexAxis,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    scales: {
      x: {
        grid: {
          stacked: checked,
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

  // ** add to custom dashboard
  const [openAddPopup, setOpenAddPopup] = useState(false)

  // ** removing from chart list
  const handleRemoveFromChartList = useRemoveChart()
  const { deleteJournalistReport, reportActionLoading } = useRemove()

  const handleRemoveCharts = reportId => {
    handleRemoveFromChartList(dbId, reportId)
    deleteJournalistReport(dbId, reportId)
  }

  const TableComp = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell>Company Name</TableCell>
              <TableCell>vScore</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chartData.map((company, index) => (
              <TableRow key={index}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.vScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
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
            title='Visibility'
            action={
              <IconButton onClick={handleModalClose} sx={{ color: 'primary.main' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            {activeType === 'chart' ? (
              <>
                {' '}
                {activeChart === 'Bar' && <Bar data={data} height={500} options={options} />}
                {activeChart === 'Line' && <Line data={data} height={500} options={options} />}
                {activeChart === 'Pie' && <Pie data={data} height={500} options={options} />}
                {activeChart === 'Doughnut' && <Doughnut data={data} height={500} options={options} />}
              </>
            ) : (
              <TableComp />
            )}
          </CardContent>
        </Card>
      </Dialog>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title='Visibility Ranking'
          action={
            <Box>
              {chartIndexAxis === 'x' ? (
                <IconButton
                  onClick={() => {
                    setActiveChart('Bar')
                    setChartIndexAxis('y')
                  }}
                  sx={{
                    backgroundColor: activeChart === 'Bar' ? 'primary.main' : '',
                    color: activeChart === 'Bar' ? 'inherit' : 'primary.main'
                  }}
                >
                  <IconifyIcon icon='ic:baseline-bar-chart' />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setActiveChart('Bar')
                    setChartIndexAxis('x')
                  }}
                  sx={{
                    backgroundColor: activeChart === 'Bar' ? 'primary.main' : '',
                    color: activeChart === 'Bar' ? 'inherit' : 'primary.main',
                    transform: 'rotate(90deg)'
                  }}
                >
                  <IconifyIcon icon='ic:baseline-bar-chart' />
                </IconButton>
              )}
              <IconButton
                onClick={() => {
                  setChartIndexAxis('x')
                  setActiveChart('Line')
                }}
                sx={{
                  backgroundColor: activeChart === 'Line' ? 'primary.main' : '',
                  color: activeChart === 'Line' ? 'inherit' : 'primary.main'
                }}
              >
                <IconifyIcon icon='lets-icons:line-up' />
              </IconButton>
              <Switch
                checked={checked}
                onChange={handleChange}
                sx={{ color: activeChart === 'Line' ? 'inherit' : 'primary.main' }}
                inputProps={{ 'aria-label': 'toggle button' }}
              />
              <IconButton aria-haspopup='true' onClick={handleIconClick}>
                <IconifyIcon icon='tabler:dots-vertical' />
              </IconButton>
              <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
                {/* <MenuItem onClick={() => setActiveMenu('media')}>Media</MenuItem> */}
                {asPath !== '/dashboards/visibility-image-qe/' ? (
                  <MenuItem onClick={() => handleRemoveCharts('visibilityRanking')}>
                    {reportActionLoading ? <CircularProgress /> : 'Remove from Custom'}
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => setOpenAddPopup(true)}>Add To Custom</MenuItem>
                )}
                <MenuItem onClick={() => setActiveMenu('chart')}>Chart Types</MenuItem>
                {activeType === 'chart' ? (
                  <>
                    {' '}
                    <MenuItem onClick={() => handleMenuClick('table')}>Table</MenuItem>
                    <MenuItem onClick={() => handleMenuClick('image')} disabled={!chartData.length}>
                      Download Image
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClick('pdf')} disabled={!chartData.length}>
                      Download PDF
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleMenuClick('chart')}>Chart</MenuItem>
                    <MenuItem onClick={() => handleMenuClick('xlsx')} disabled={!chartData.length}>
                      Download Xlsx
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          }
        />
        <Box>
          {' '}
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl) && activeMenu === 'chart'}
          >
            {renderMenuItems(chartItems, 'chart')}
          </Menu>
        </Box>
        <CardContent onClick={handleChartClick} id='visibility-ranking'>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeType === 'chart' ? (
                <>
                  {activeChart === 'Bar' && <Bar data={data} height={325} options={options} />}
                  {activeChart === 'Line' && <Line data={data} height={325} options={options} />}
                  {activeChart === 'Pie' && <Pie data={data} height={325} options={options} />}
                  {activeChart === 'Doughnut' && <Doughnut data={data} height={325} options={options} />}
                </>
              ) : (
                <TableComp />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} reportId={'visibilityRanking'} path={path} />
    </>
  )
}

export default VisibilityRanking
