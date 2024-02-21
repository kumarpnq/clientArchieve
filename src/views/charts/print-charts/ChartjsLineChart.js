// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import { useState, useEffect } from 'react'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

// ** third party imports
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ** Third Party Imports
import { Line } from 'react-chartjs-2'

const ChartjsLineChart = props => {
  const [companies, setCompanies] = useState([])
  const [companyIds, setCompanyIds] = useState([])
  const [priorityCompanyListByClients, setPriorityCompanyListByClients] = useState([])
  const [companyListByClients, setCompanyListByClients] = useState([])
  const [priorityLargestCountForYaxis, setPriorityLargestCountForYaxis] = useState(0)
  const [largestCountForYaxis, setLargestCountForYaxis] = useState(0)
  const [downloadAnchor, setDownloadAnchor] = useState(null)
  const [loadingJPG, setLoadingJPG] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const BASE_URL = 'http://51.68.220.77:8001'
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const storedToken = localStorage.getItem('accessToken')
  const priorityCompanyId = selectedClient ? selectedClient.priorityCompanyId : ''

  // let priorityCompanyName = 'TATA CONSTRUCTION & PROJECTS PROJECTS'
  useEffect(() => {
    if (companyListByClients.length > 0) {
      const counts = companyListByClients.map(item => Math.max(...item.dailyCounts.map(subItem => subItem.count)))
      const maxCount = Math.max(...counts)
      const roundedMaxCount = Math.ceil(maxCount / 10) * 10
      setLargestCountForYaxis(roundedMaxCount)
    }
  }, [companyListByClients])

  // ** Props
  const { white, primary, success, warning, labelColor, borderColor, legendColor } = props

  const datesForChart =
    companyListByClients.length > 0 ? companyListByClients[0].dailyCounts.map(entry => entry.date) : []

  const priorityDatesForChart =
    priorityCompanyListByClients.length > 0 ? priorityCompanyListByClients[0].dailyCounts.map(entry => entry.date) : []

  // Use the appropriate dates based on whether priority or regular is selected
  const chartLabels = companyListByClients.length > 0 ? datesForChart : priorityDatesForChart

  // Use the appropriate Y-axis maximum based on whether priority or regular is selected
  const yAxisMax = companyListByClients.length > 0 ? largestCountForYaxis || 10 : priorityLargestCountForYaxis || 10

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          color: borderColor
        }
      },
      y: {
        min: 0,
        max: yAxisMax,
        ticks: {
          stepSize: Math.ceil(yAxisMax / 2),
          color: labelColor
        },
        grid: {
          color: borderColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const getRandomColor = () => {
    // You can implement your logic to generate random colors
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    return color
  }

  const priorityDataSets = priorityCompanyListByClients.map(item => {
    return {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: item.company.name,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: primary,
      backgroundColor: primary,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: primary,
      data: item.dailyCounts.map(subItem => subItem.count)
    }
  })

  const dataSets = companyListByClients.map(item => {
    const lineColor = getRandomColor()

    return {
      fill: false,
      tension: 0.5,
      pointRadius: 1,
      label: item.company.name,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      borderColor: lineColor,
      backgroundColor: lineColor,
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: white,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: primary,
      data: item.dailyCounts.map(subItem => subItem.count)
    }
  })

  const data = {
    labels: chartLabels,
    datasets: [...priorityDataSets, ...dataSets]
  }

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const response = await axios.get('http://51.68.220.77:8001/companyListByClient/', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: {
              clientId: clientId
            }
          })
          setCompanies(response.data.companies)
        }
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      }
    }

    fetchUserDataAndCompanies()
  }, [clientId])
  function fetchPriorityPrintMediaCoverage() {
    let headers = {
      Authorization: `Bearer ${storedToken}`,
      'Content-Type': 'application/json'
    }

    const URL = `${BASE_URL}/printMediaCoverage/?clientId=${clientId}&companyIds=${priorityCompanyId}`
    axios
      .get(URL, { headers })
      .then(response => setPriorityCompanyListByClients(response.data.mediaCoverageCounts))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const fetchPrintMediaCoverage = async () => {
      let headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      let params = {
        clientId,
        companyIds: companyIds.join('&companyIds=')
      }

      const queryString = Object.keys(params)
        .map(key => {
          if (key === 'companyIds') {
            return `${encodeURIComponent(key)}=${params[key]}`
          }

          return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        })
        .join('&')

      const URL = `${BASE_URL}/printMediaCoverage?${queryString}`

      try {
        const response = await axios.get(URL, { headers })
        setCompanyListByClients(response.data.mediaCoverageCounts)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPrintMediaCoverage()
  }, [companyIds])
  useEffect(() => {
    fetchPriorityPrintMediaCoverage()
  }, [clientId])

  useEffect(() => {
    if (priorityCompanyListByClients.length > 0) {
      const counts = priorityCompanyListByClients.map(item =>
        Math.max(...item.dailyCounts.map(subItem => subItem.count))
      )
      const maxCount = Math.max(...counts)
      const roundedMaxCount = Math.ceil(maxCount / 10) * 10
      setPriorityLargestCountForYaxis(roundedMaxCount)
    }
  }, [priorityCompanyListByClients])

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
      const chartContainer = document.getElementById('chart-container')

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
      const chartContainer = document.getElementById('chart-container')

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
        title='Media Coverage'
        action={
          <FormControl sx={{ marginLeft: '5rem' }}>
            <InputLabel id='competitor-label'>Select competitor</InputLabel>
            <Select
              label='Select Company'
              multiple
              value={companyIds}
              onChange={e => setCompanyIds(e.target.value)}
              inputProps={{ id: 'company-select' }}
              style={{ width: '200px' }}
            >
              {companies?.map(item => (
                <MenuItem key={item.companyId} value={item.companyId}>
                  {item.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      <CardContent id='chart-container'>
        <Line data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsLineChart
