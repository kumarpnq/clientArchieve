'use client';
import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// icons
import IconifyIcon from 'src/@core/components/icon'

// ** apex charts
// import ReactApexCharts from 'react-apexcharts'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// ** third party imports
import { toBlob } from 'html-to-image'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'


import usePath from 'src/@core/utils/usePath'
import useRemoveChart from 'src/@core/utils/useRemoveChart'
import AddScreen from 'src/custom/AddScreenPopup'
import useRemove from 'src/hooks/useRemoveChart'

// ** redux
import { useSelector } from 'react-redux'
import { userDashboardId } from 'src/store/apps/user/userSlice'
import CardActions from '../components/CardActions'
import DpMenu from '../components/DpMenu'

Chart.register(...registerables)

const CompanyTonality = props => {
  const { chartData, loading, error, path, primary, yellow, warning, info, grey, green, legendColor } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeType, setActiveType] = useState('chart')
  const [chartIndexAxis, setChartIndexAxis] = useState('x')
  const [activeChart, setActiveChart] = useState('Line')
  const [checked, setChecked] = useState(false)
  const [activeMenu, setActiveMenu] = useState('main')
  const [selectedFilter, setSelectedFilter] = useState('Top')
  const [selectedCount, setSelectedCount] = useState(10)
  const dbId = useSelector(userDashboardId)

  const handleChange = () => {
    setActiveChart('Bar')
    setChecked(prev => !prev)
  }

  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  // Function to generate a random hex color
  function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    return color
  }

  // Function to generate an array of random colors
  function generateRandomColors(numColors) {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      colors.push(getRandomColor())
    }

    return colors
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
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        grid: {
          display: true
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  }

  // Chart configuration object
  const data = {
    labels: chartData.map(data => data.tonality),
    datasets: [
      {
        label: 'Negative',
        backgroundColor: additionalColors[0],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.filter(data => data.tonality === 'negative').map(data => data.vScore)

        // ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'Neutral',
        backgroundColor: additionalColors[1],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.filter(data => data.tonality === 'neutral').map(data => data.vScore)

        // ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'Positive',
        backgroundColor: additionalColors[2],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.filter(data => data.tonality === 'positive').map(data => data.vScore)

        // ...(checked && { stack: 'Stack 1' })
      }
    ]
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
        toBlob(document.getElementById('company-tonality')).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'company-tonality.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById('company-tonality')).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save('company-tonality.pdf')
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
          XLSX.writeFile(wb, 'companyTonality.xlsx')
        }
        break
      default:
        break
    }
    handleClose() // Close the menu after handling the selection
  }

  const handleIconClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setActiveMenu('main')
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (item, menu) => {
    if (menu === 'count') {
      setSelectedCount(item)
    } else if (menu === 'filter') {
      setSelectedFilter(item)
    }
    setActiveMenu(menu)
    setAnchorEl(null)
  }

  const renderMenuItems = (items, menuType) => {
    return items.map(item => (
      <MenuItem key={item} onClick={() => handleClick(item, menuType)} selected={activeChart === item}>
        {item}
      </MenuItem>
    ))
  }

  // modal
  const [isChartClicked, setIsChartClicked] = useState(false)

  const handleChartClick = () => {
    setIsChartClicked(true)
  }

  const handleModalClose = () => {
    setIsChartClicked(false)
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

  return (
    <>
      <Dialog open={isChartClicked} onClose={handleModalClose} maxWidth='lg' fullWidth>
        <Card>
          <CardHeader
            title='Company Tonality Vscore'
            action={
              <IconButton onClick={handleModalClose} sx={{ color: 'primary.main' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            {activeType === 'chart' && <Bar data={data} height={500} options={options} />}
            {activeType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                      <TableCell>Tonality</TableCell>
                      <TableCell>vScore</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.tonality}</TableCell>
                        <TableCell>{item.vScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Dialog>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title='Company Tonality Vscore'
          action={
            <CardActions
              chartIndexAxis={chartIndexAxis}
              activeChart={activeChart}
              setActiveChart={setActiveChart}
              setChartIndexAxis={setChartIndexAxis}
              checked={checked}
              handleChange={handleChange}
              handleIconClick={handleIconClick}
              anchorEl={anchorEl}
              handleClose={handleClose}
              asPath={path}
              currentPath='/dashboards/tonality/'
              handleRemoveCharts={handleRemoveCharts}
              reportId={'companyTonality'}
              reportActionLoading={reportActionLoading}
              setOpenAddPopup={setOpenAddPopup}
              setActiveMenu={setActiveMenu}
              activeType={activeType}
              handleMenuClick={handleMenuClick}
              chartData={chartData}
              isCount={false}
            />
          }
        />
        <DpMenu
          activeMenu={activeMenu}
          anchorEl={anchorEl}
          handleClose={handleClose}
          renderMenuItems={renderMenuItems}
        />
        <CardContent onClick={handleChartClick} id='company-tonality'>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {' '}
              {activeType === 'chart' ? (
                <Bar data={data} height={350} options={options} />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                      <TableRow>
                        <TableCell>Tonality</TableCell>
                        <TableCell>vScore</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {chartData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.tonality}</TableCell>
                          <TableCell>{item.vScore}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} reportId={'companyTonality'} path={path} />
    </>
  )
}

export default CompanyTonality
