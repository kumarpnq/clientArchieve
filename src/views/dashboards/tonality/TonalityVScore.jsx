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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// icons
import IconifyIcon from 'src/@core/components/icon'

// ** third party imports
import { toBlob } from 'html-to-image'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

// ** charts
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// ** redux
import { useSelector } from 'react-redux'
import { userDashboardId } from 'src/store/apps/user/userSlice'

// * custom
import DpMenu from '../components/DpMenu'
import useRemove from 'src/hooks/useRemoveChart'
import useRemoveChart from 'src/@core/utils/useRemoveChart'
import AddScreen from 'src/custom/AddScreenPopup'
import CardActions from '../components/CardActions'

Chart.register(...registerables)

const TonalityVScore = props => {
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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }

    return array
  }

  shuffleArray(backgroundColors)

  let colorIndex = 0

  const getRandomColor = () => {
    const color = backgroundColors[colorIndex]
    colorIndex = (colorIndex + 1) % backgroundColors.length // Move to the next color

    return color
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

  const data = {
    labels: chartData.map(data => data?.companyName?.substring(0, 15)),
    datasets: [
      {
        label: 'Negative',
        backgroundColor: warning,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.negative),
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'Neutral',
        backgroundColor: yellow,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.neutral),
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'positive',
        backgroundColor: green,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: chartData.map(data => data.positive),
        ...(checked && { stack: 'Stack 1' })
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
        toBlob(document.getElementById('tonality-vScore')).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'tonalityVScore.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById('tonality-vScore')).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save('tonalityVScore.pdf')
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
          XLSX.writeFile(wb, 'tonalityVScore.xlsx')
        }
        break
      default:
        break
    }
    handleClose() // Close the menu after handling the selection
  }

  // *
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

  // modal
  const [isChartClicked, setIsChartClicked] = useState(false)

  const handleChartClick = () => {
    setIsChartClicked(true)
  }

  const handleModalClose = () => {
    setIsChartClicked(false)
  }

  const getColorStyle = company => {
    if (company.negative === 0 && company.neutral === 0 && company.positive === 0) {
      return { backgroundColor: '#FECACA' } // Example color for zero values
    }

    return {}
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
              <TableCell size='small'>Company</TableCell>
              <TableCell size='small'>Negative</TableCell>
              <TableCell size='small'>Neutral</TableCell>
              <TableCell size='small'>Positive</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chartData.map((company, index) => (
              <TableRow key={index} sx={getColorStyle(company)}>
                <TableCell size='small'>{company.companyName}</TableCell>
                <TableCell size='small'>{company.negative}</TableCell>
                <TableCell size='small'>{company.neutral}</TableCell>
                <TableCell size='small'>{company.positive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <Dialog open={isChartClicked} onClose={handleModalClose} maxWidth='lg' fullWidth>
        <Card>
          <CardHeader
            title='Tonality VScore'
            action={
              <IconButton onClick={handleModalClose} sx={{ color: 'primary.main' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            {activeType === 'chart' && <Bar data={data} height={500} options={options} />}
            {activeType === 'table' && <TableComp />}
          </CardContent>
        </Card>
      </Dialog>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title='Tonality VScore'
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
              reportId={'tonalityVscore'}
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
        <CardContent onClick={handleChartClick} id='tonality-vScore'>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>{activeType === 'chart' ? <Bar data={data} height={350} options={options} /> : <TableComp />}</>
          )}
        </CardContent>
      </Card>
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} reportId={'tonalityVscore'} path={path} />
    </>
  )
}

export default TonalityVScore
