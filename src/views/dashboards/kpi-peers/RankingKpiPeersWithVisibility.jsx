'use client';
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CloseIcon from '@mui/icons-material/Close'
import { Line, Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import IconifyIcon from 'src/@core/components/icon'
import Switch from '@mui/material/Switch'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

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

const RankingKpiPeersCharts = props => {
  const { currentPath, asPath } = usePath()
  const [activeChart, setActiveChart] = useState('Line')
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeMenu, setActiveMenu] = useState('main')
  const [chartLoaded, setChartLoaded] = useState(false)
  const [selectedCount, setSelectedCount] = useState(10)
  const [selectedFilter, setSelectedFilter] = useState('Top')
  const [chartIndexAxis, setChartIndexAxis] = useState('x')
  const [checked, setChecked] = useState(false)
  const [activeType, setActiveType] = useState('chart')
  const dbId = useSelector(userDashboardId)

  const handleChange = () => {
    setActiveChart('Bar')
    setChecked(prev => !prev)
  }

  const {
    chartData,
    loading,
    error,
    chartTitle,
    chartId,
    reportId,
    path,
    primary,
    yellow,
    warning,
    info,
    grey,
    green,
    legendColor
  } = props

  const topData = chartData.length > 0 ? chartData.slice(0, selectedCount) : []
  const bottomData = chartData.length > 0 ? chartData.slice(-selectedCount) : []
  const dataForCharts = topData || bottomData

  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']
  let backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

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
        stacked: checked,
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

  const AVEMN = chartData.map(data => data['AVE(mn)'])
  const QE = chartData.map(data => data.QE)
  const iScore = chartData.map(data => data.iScore)
  const vScore = chartData.map(data => data.vScore)
  const ReachMN = chartData.map(data => data['reach(mn)'])
  const volume = chartData.map(data => data.volume)

  const data = {
    labels: chartData.map(data => data.companyName.substring(0, 15)),
    datasets: [
      {
        type: 'line',
        label: 'Average',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: [...AVEMN, ...QE, ...iScore, ...ReachMN, ...volume]
      },
      {
        label: 'ave(mn)',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: AVEMN,
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'QE',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: QE,
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'iScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: iScore,
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'reach(mn)',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: ReachMN,
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'Volume',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: volume,
        ...(checked && { stack: 'Stack 1' })
      },
      {
        label: 'vScore',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: vScore,
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
        toBlob(document.getElementById(chartId)).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${chartId}.png`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById(chartId)).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save(`${chartId}.pdf`)
            URL.revokeObjectURL(url)
          }
          img.src = url
        })
        break
      case 'xlsx':
        if (chartData) {
          const ws = XLSX.utils.json_to_sheet(chartData)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, `${chartId} Data`)
          XLSX.writeFile(wb, `${chartId}.xlsx`)
        }
        break
      default:
        break
    }
    handleClose()
  }

  useEffect(() => {
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

  const TableComp = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell>AVE(mn)</TableCell>
              <TableCell>QE</TableCell>
              <TableCell>iScore</TableCell>
              <TableCell>vScore</TableCell>
              <TableCell>Reach(mn)</TableCell>
              <TableCell>Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chartData.map((item, index) => (
              <TableRow key={index}>
                <TableCell size='small'>{item['AVE(mn)']}</TableCell>
                <TableCell size='small'>{item.QE}</TableCell>
                <TableCell size='small'>{item.iScore}</TableCell>
                <TableCell size='small'>{item.vScore}</TableCell>
                <TableCell size='small'>{item['reach(mn)']}</TableCell>
                <TableCell size='small'>{item.volume}</TableCell>
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
            title={chartTitle}
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
              </>
            ) : (
              <TableComp />
            )}
          </CardContent>
        </Card>
      </Dialog>
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={chartTitle}
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
                onClick={() => setActiveChart('Line')}
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
                {asPath !== '/dashboards/kpi-peers/' ? (
                  <MenuItem onClick={() => handleRemoveCharts(reportId)}>
                    {reportActionLoading ? <CircularProgress /> : 'Remove from Custom'}
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => setOpenAddPopup(true)}>Add To Custom</MenuItem>
                )}
                <MenuItem onClick={() => setActiveMenu('count')}>Count</MenuItem>
                <MenuItem onClick={() => setActiveMenu('filter')}>Filter</MenuItem>
                {activeType === 'chart' ? (
                  <>
                    {' '}
                    <MenuItem onClick={() => handleMenuClick('table')}>Table</MenuItem>
                    <MenuItem onClick={() => handleMenuClick('image')}>Download Image</MenuItem>
                    <MenuItem onClick={() => handleMenuClick('pdf')}>Download PDF</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleMenuClick('chart')}>Chart</MenuItem>
                    <MenuItem onClick={() => handleMenuClick('xlsx')}>Download Xlsx</MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          }
        />
        <Box>
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl) && activeMenu === 'count'}
          >
            {renderMenuItems([10, 20, 30], 'count')}
          </Menu>

          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl) && activeMenu === 'filter'}
          >
            {renderMenuItems(['Top', 'Bottom'], 'filter')}
          </Menu>
        </Box>
        <CardContent onClick={handleChartClick} id={chartId}>
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
                </>
              ) : (
                <TableComp />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} reportId={reportId} path={path} />
    </>
  )
}

export default RankingKpiPeersCharts
