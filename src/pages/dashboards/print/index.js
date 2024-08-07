// ** Next Import
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

// ** Demo Components Imports

import ChartjsPolarAreaChart from 'src/views/charts/print-charts/ChartjsPolarAreaChart'
import ChartjsTable from 'src/views/charts/print-charts/ChartjsTable'
import ChartsAppBar from 'src/views/charts/print-charts/ChartsAppBar'
import ChartjsLineChart from 'src/views/charts/print-charts/ChartjsLineChart'

// ** Third Party Styles Import
import 'chart.js/auto'
import ChartjsBarChart from 'src/views/charts/print-charts/ChartjsBarChart'
import ArticleCountDistribution from 'src/views/charts/print-charts/ArticleCountDistribution'
import TopNewsToday from 'src/views/charts/print-charts/TopNewsToday'
import TopNewsForCompetitors from 'src/views/charts/print-charts/TopNewsForCompetitors'
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import { BASE_URL } from 'src/api/base'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ChartJS = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [selectedCity, setSelectedCity] = useState([])
  const [shareOfVoiceData, setShareOfVoiceData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const fetchArticlesStatsForCompetition = async () => {
    try {
      setTableLoading(true)
      const storedToken = localStorage.getItem('accessToken')

      let headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }
      let params = { clientId, dateRange: selectedDateRange, cityId: selectedCity }

      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      const URL = `${BASE_URL}/articlesStatsForCompetition?${queryString}`
      const response = await axios.get(URL, { headers })
      setShareOfVoiceData(response?.data?.statistics || [])
    } catch (error) {
      console.log('Error in fetching article stats for competition', error)
    } finally {
      setTableLoading(false)
    }
  }
  useEffect(() => {
    fetchArticlesStatsForCompetition()
  }, [clientId, selectedCity, selectedDateRange])

  // ** Hook
  const theme = useTheme()

  // Vars
  const whiteColor = '#fff'
  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const areaChartBlue = '#2c9aff'
  const barChartYellow = '#ffcf5c'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const lineChartYellow = '#d4e157'
  const polarChartGreen = '#28dac6'
  const lineChartPrimary = '#8479F2'
  const lineChartWarning = '#ff9800'
  const horizontalBarInfo = '#26c6da'
  const polarChartWarning = '#ff8131'
  const scatterChartGreen = '#28c76f'
  const warningColorShade = '#ffbd1f'
  const areaChartBlueLight = '#84d0ff'
  const areaChartGreyLight = '#edf1f4'
  const scatterChartWarning = '#ff9f43'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const legendColor = theme.palette.text.secondary

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['printDashboard']

  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Print Dashboard</Typography>} />
        <Grid item xs={12}>
          <ArticleCountDistribution />
        </Grid>
        <Grid item xs={12}>
          <ChartjsLineChart
            white={whiteColor}
            labelColor={labelColor}
            success={lineChartYellow}
            borderColor={borderColor}
            legendColor={legendColor}
            primary={lineChartPrimary}
            warning={lineChartWarning}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartsAppBar
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Pass color variables as props */}
          <ChartjsPolarAreaChart
            shareOfVoiceData={shareOfVoiceData}
            tableLoading={tableLoading}
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartjsTable tableData={shareOfVoiceData} />
        </Grid>
        <Grid item xs={12}>
          <ChartjsBarChart
            companyData={shareOfVoiceData} // Pass the company data to the bar chart
            primary={primaryColor}
            labelColor={theme.palette.text.disabled}
            borderColor={theme.palette.divider}
            legendColor={legendColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopNewsToday />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopNewsForCompetitors />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ChartJS
