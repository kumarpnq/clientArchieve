// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

// ** Third Party Imports
import { PolarArea, Line, Bar, Radar, Doughnut, Bubble, Scatter, Pie } from 'react-chartjs-2'

// ** third party imports
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ** Custom Components Imports
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'

const ChartjsPolarAreaChart = props => {
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [loadingJPG, setLoadingJPG] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  // ** Props
  const { shareOfVoiceData, primary, yellow, warning, info, grey, green, legendColor } = props

  // Define an array of colors
  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      },

      tooltip: {
        callbacks: {
          label: tooltipItem => {
            const value = tooltipItem.formattedValue || tooltipItem.value
            const intValue = Math.round(value)

            return `${tooltipItem.label}: ${intValue}%`
          }
        }
      }
    }
  }

  // Use the primary and additional colors
  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const data = {
    labels: shareOfVoiceData.map(entry => entry.companyName),
    datasets: [
      {
        borderWidth: 0,

        label: 'Share of Voice',
        data: shareOfVoiceData.map(entry => entry.articlesPercent),
        backgroundColor: backgroundColors.slice(0, shareOfVoiceData.length)
      }
    ]
  }

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  // Function to handle JPEG download
  const handleJPEGDownload = async () => {
    setLoadingJPG(true)
    try {
      const chartContainer = document.getElementById('chart-polar-container')

      if (!chartContainer) {
        return
      }

      // Use html2canvas to capture the chart as an image
      const canvas = await html2canvas(chartContainer)

      // Create a download link for the image
      const dataURL = canvas.toDataURL('image/jpeg')
      const link = document.createElement('a')
      link.href = dataURL
      link.download = 'chart.jpg'

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      setLoadingJPG(false)
    } catch (error) {
      console.error('Error generating JPEG:', error)
      setLoadingJPG(false)
    }
  }

  const handlePDFDownload = async () => {
    setLoadingPDF(true)
    try {
      const chartContainer = document.getElementById('chart-polar-container')

      if (!chartContainer) {
        return
      }

      // Use html2canvas to capture the chart as an image
      const canvas = await html2canvas(chartContainer)

      // Create a PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 210, 297)

      // Create a download link for the PDF
      pdf.save('chart.pdf')

      setLoadingPDF(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setLoadingPDF(false)
    }
  }

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeChart, setActiveChart] = useState('polar')

  const handleClick = item => {
    setActiveChart(item)
    setAnchorEl(null)
  }

  const handleIconClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title='Share of Voice'
        action={
          <Box>
            <IconButton aria-haspopup='true' onClick={handleIconClick}>
              <IconifyIcon icon='tabler:dots-vertical' />
            </IconButton>
            <Menu keepMounted anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
              <MenuItem onClick={() => handleClick('polar')} selected={activeChart === 'polar'}>
                Polar
              </MenuItem>
              <MenuItem onClick={() => handleClick('bar')} selected={activeChart === 'bar'}>
                Bar
              </MenuItem>
              <MenuItem onClick={() => handleClick('line')} selected={activeChart === 'line'}>
                Line
              </MenuItem>
              <MenuItem onClick={() => handleClick('radar')} selected={activeChart === 'radar'}>
                Radar
              </MenuItem>
              {/* <MenuItem onClick={() => handleClick('doughnut')} selected={activeChart === 'Doughnut'}>
                Doughnut
              </MenuItem>
              <MenuItem onClick={() => handleClick('bubble')} selected={activeChart === 'Bubble'}>
                Bubble
              </MenuItem>
              <MenuItem onClick={() => handleClick('pie')} selected={activeChart === 'pie'}>
                Pie
              </MenuItem>
              <MenuItem onClick={() => handleClick('scatter')} selected={activeChart === 'scatter'}>
                Scatter
              </MenuItem> */}
            </Menu>
          </Box>
        }
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', mr: 3 }}>
        <Button endIcon={<DownloadIcon />} onClick={e => openDropdown(e, setDownloadAnchor)} color='inherit' />
      </Box>
      <Menu open={Boolean(downloadAnchor)} anchorEl={downloadAnchor} onClose={() => closeDropdown(setDownloadAnchor)}>
        <MenuItem sx={{ cursor: 'pointer' }} onClick={handleJPEGDownload}>
          <Button disabled={loadingJPG}>
            {loadingJPG ? <CircularProgress size={24} color='primary' /> : 'Download JPG'}
          </Button>
        </MenuItem>
        <MenuItem sx={{ cursor: 'pointer' }} onClick={handlePDFDownload}>
          <Button disabled={loadingJPG}>
            {loadingPDF ? <CircularProgress size={24} color='primary' /> : 'Download PDF'}
          </Button>
        </MenuItem>
      </Menu>
      <CardContent id='chart-polar-container'>
        {
          (activeChart === 'polar' && <PolarArea data={data} height={350} options={options} />) ||
            (activeChart === 'bar' && <Bar data={data} height={350} options={options} />) ||
            (activeChart === 'line' && <Line data={data} height={350} options={options} />) ||
            (activeChart === 'radar' && <Radar data={data} height={350} options={options} />)

          // (activeChart === 'doughnut' && <Doughnut data={data} height={350} options={options} />) ||
          // (activeChart === 'bubble' && <Bubble data={data} height={350} options={options} />) ||
          // (activeChart === 'pie' && <Pie data={data} height={350} options={options} />) ||
          // (activeChart === 'scatter' && <Scatter data={data} height={350} options={options} />)}
        }
      </CardContent>
    </Card>
  )
}

export default ChartjsPolarAreaChart
