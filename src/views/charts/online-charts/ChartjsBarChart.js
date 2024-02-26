// ChartjsBarChart.js
import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Bar } from 'react-chartjs-2'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

// ** third party imports
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ChartjsBarChart = props => {
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [loadingJPG, setLoadingJPG] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const { companyData, primary, labelColor, borderColor, legendColor, warning, info, grey, green, yellow } = props

  // Define an array of additional colors
  const additionalColors = ['#ff5050', '#3399ff', '#ff6600', '#33cc33', '#9933ff', '#ffcc00']

  // Sort companyData based on articleCount in descending order
  // const sortedCompanyData = companyData.slice().sort((a, b) => b.articleCount - a.articleCount)

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

  // Use the primary and additional colors
  const backgroundColors = [primary, yellow, warning, info, grey, green, ...additionalColors]

  const data = {
    labels: companyData.map(data => data.companyName.substring(0, 15)),

    datasets: [
      {
        label: 'Article Count',
        backgroundColor: backgroundColors.slice(0, companyData.length),

        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        data: companyData.map(data => data.articlesCount)
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
      const chartContainer = document.getElementById('chart-bar-container')

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
      const chartContainer = document.getElementById('chart-bar-container')

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
    <Card>
      <CardHeader title='Volume Rank' />

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
      <CardContent id='chart-bar-container'>
        <Bar data={data} height={500} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsBarChart
