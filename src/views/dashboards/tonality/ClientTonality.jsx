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
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'

Chart.register(...registerables)

// ** third party imports
import { toBlob } from 'html-to-image'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

// ** redux
import { useSelector } from 'react-redux'
import { userDashboardId } from 'src/store/apps/user/userSlice'

// * custom
import DpMenu from '../components/DpMenu'
import useRemove from 'src/hooks/useRemoveChart'
import useRemoveChart from 'src/@core/utils/useRemoveChart'
import AddScreen from 'src/custom/AddScreenPopup'
import CardActions from '../components/CardActions'

const ClientTonality = props => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeChart, setActiveChart] = useState('Line')
  const [activeMenu, setActiveMenu] = useState('main')
  const [chartLoaded, setChartLoaded] = useState(false)
  const [activeType, setActiveType] = useState('chart')
  const [chartIndexAxis, setChartIndexAxis] = useState('x')
  const [checked, setChecked] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('Top')
  const [selectedCount, setSelectedCount] = useState(10)
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

  const handleMenuClick = menuItem => {
    switch (menuItem) {
      case 'chart':
        setActiveType('chart')
        break
      case 'table':
        setActiveType('table')
        break
      case 'image':
        toBlob(document.getElementById('client-tonality')).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'client-tonality.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById('client-tonality')).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save('client-tonality.pdf')
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
          XLSX.writeFile(wb, 'clientTonality.xlsx')
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
    labels: chartData.map(data => data.tonality),
    datasets: [
      {
        label: 'vScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.vScore),
        ...(checked && { stack: 'Stack 1' })
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
              <TableCell>Tonality</TableCell>
              <TableCell>V-Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chartData.map((company, index) => (
              <TableRow key={index}>
                <TableCell>{company.tonality}</TableCell>
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
            title='ClientTonality'
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
          title='Client Tonality'
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
              reportId={'clientTonality'}
              reportActionLoading={reportActionLoading}
              setOpenAddPopup={setOpenAddPopup}
              setActiveMenu={setActiveMenu}
              activeType={activeType}
              handleMenuClick={handleMenuClick}
              chartData={chartData}
            />
          }
        />
        <DpMenu
          activeMenu={activeMenu}
          anchorEl={anchorEl}
          handleClose={handleClose}
          renderMenuItems={renderMenuItems}
        />
        <CardContent onClick={handleChartClick} id='client-tonality'>
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
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} reportId={'clientTonality'} path={path} />
    </>
  )
}

export default ClientTonality
