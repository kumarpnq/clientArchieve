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

const Journalist = props => {
  const { currentPath, asPath } = usePath()
  const { journalistData, loading, error, primary, yellow, warning, info, grey, green, legendColor } = props
  const publications = Object.keys(journalistData || {})

  const [selectedPublication, setSelectedPublication] = useState('')
  const [chartData, setChartData] = useState([])
  const [activeChart, setActiveChart] = useState('Line')
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorE2, setAnchorE2] = useState(null)
  const [activeMenu, setActiveMenu] = useState('main')
  const [chartLoaded, setChartLoaded] = useState(false)
  const [selectedCount, setSelectedCount] = useState(10)
  const [selectedFilter, setSelectedFilter] = useState('Top')
  const [chartIndexAxis, setChartIndexAxis] = useState('x')
  const [checked, setChecked] = useState(false)
  const [activeType, setActiveType] = useState('chart')

  useEffect(() => {
    if (publications) {
      const randomIndex = Math.floor(Math.random() * publications.length)
      const randomPublication = publications[randomIndex]
      setChartData(journalistData[randomPublication] || [])
      setSelectedPublication(randomPublication)
    }
  }, [])

  const handleChange = () => {
    setActiveChart('Bar')
    setChecked(prev => !prev)
  }

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

  const volume = []
  const vScore = []
  const qe = []
  const volumeSov = []

  for (const publication in journalistData) {
    const publicationEntries = journalistData[publication]
    for (const entry of publicationEntries) {
      volume.push(entry.volume)
      vScore.push(entry.vScore)
      qe.push(entry.QE)
      volumeSov.push(entry.volumeSOV)
    }
  }

  const data = {
    labels: Object.keys(journalistData).map(key => key.slice(0, 15)),
    datasets: [
      {
        type: 'line',
        label: 'Average',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: [...volume, ...vScore, ...qe, ...volumeSov]
      },
      {
        label: 'visibility',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: volume,
        stack: 'Stack 1'
      },
      {
        label: 'volume',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: vScore,
        stack: 'Stack 1'
      },
      {
        label: 'volume SOV',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: qe,
        stack: 'Stack 2'
      },
      {
        label: 'visibility SOV',
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: volumeSov,
        stack: 'Stack 2'
      }
    ]
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

  // regionClick
  const handlePublicationClick = publication => {
    setSelectedPublication(publication)
    const data = journalistData[publication] || []
    setChartData(data)
    setAnchorE2(null)
  }

  const flattenPublicationData = data => {
    const flattenedData = []
    for (const [companyName, records] of Object.entries(data)) {
      records.forEach(record => {
        flattenedData.push({
          companyName,
          volume: record.volume,
          vScore: record.vScore,
          QE: record.QE,
          volumeSOV: record.volumeSOV
        })
      })
    }

    return flattenedData
  }
  const flattenedData = flattenPublicationData(journalistData)

  const handleMenuClick = menuItem => {
    switch (menuItem) {
      case 'chart':
        setActiveType('chart')
        break
      case 'table':
        setActiveType('table')
        break
      case 'image':
        toBlob(document.getElementById('journalist')).then(function (blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'journalist.png'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        })
        break
      case 'pdf':
        const doc = new jsPDF()
        toBlob(document.getElementById('journalist')).then(function (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = function () {
            doc.addImage(this, 'PNG', 10, 10, 180, 100)
            doc.save('journalist.pdf')
            URL.revokeObjectURL(url)
          }
          img.src = url
        })
        break
      case 'xlsx':
        if (journalistData) {
          const ws = XLSX.utils.json_to_sheet(flattenedData)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Journalist Data')
          XLSX.writeFile(wb, 'journalist.xlsx')
        }
        break
      default:
        break
    }
    handleClose()
  }

  // ** add to custom dashboard
  const [openAddPopup, setOpenAddPopup] = useState(false)

  // ** removing from chart list
  const handleRemoveFromChartList = useRemoveChart()

  const TableComp = ({ data }) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: primary }}>
              <TableCell>Company Name</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell>vScore</TableCell>
              <TableCell>QE</TableCell>
              <TableCell>Volume SOV (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length &&
              data.map((data, index) => (
                <TableRow key={index}>
                  <TableCell size='small'>{data.companyName}</TableCell>
                  <TableCell size='small'>{data.volume}</TableCell>
                  <TableCell size='small'>{data.vScore}</TableCell>
                  <TableCell size='small'>{data.QE}</TableCell>
                  <TableCell size='small'>{data.volumeSOV}</TableCell>
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
            title={`Journalist`}
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
          title={`Journalist`}
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
                {asPath === '/dashboards/custom/' ? (
                  <MenuItem onClick={() => handleRemoveFromChartList('Journalist')}>Remove from Custom</MenuItem>
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
        <CardContent onClick={handleChartClick} id='region'>
          {loading ? (
            <Box>
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
                <TableComp data={flattenedData} />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AddScreen open={openAddPopup} setOpen={setOpenAddPopup} />
    </>
  )
}

export default Journalist
