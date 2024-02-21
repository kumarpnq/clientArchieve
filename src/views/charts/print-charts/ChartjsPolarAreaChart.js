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

// ** Third Party Imports
import { PolarArea } from 'react-chartjs-2'

// ** third party imports
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import { useState } from 'react'

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

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title='Share of Voice'
        action={
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            options={['Refresh', 'Edit', 'Share']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
          />
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
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsPolarAreaChart
