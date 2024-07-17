'use client'
import Link from 'next/link'
import React, { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports

// import ChartjsPolarAreaChart from 'src/views/charts/online-charts/ChartjsPolarAreaChart'
// import ChartjsTable from 'src/views/charts/online-charts/ChartjsTable'
import ChartsAppBar from 'src/views/charts/print-charts/ChartsAppBar'
import ChartjsLineChart from 'src/views/charts/print-charts/ChartjsLineChart'

import {
  filterArticlesByDateRange,
  countArticlesByCompany,
  calculateShareOfVoice,
  calculateArticleCountsByCompany
} from 'src/views/charts/online-charts/articleUtils' // Adjust the import path
import { articles } from 'src/views/table/data-grid/Db-Articles'

// ** Third Party Styles Import
import 'chart.js/auto'
import ChartjsBarChart from 'src/views/charts/online-charts/ChartjsBarChart'
import ArticleCountDistribution from 'src/views/charts/print-charts/ArticleCountDistribution'
import TopNewsToday from 'src/views/charts/online-charts/TopNewsToday'
import TopNewsForCompetitors from 'src/views/charts/online-charts/TopNewsForCompetitors'
import ChartjsPolarAreaChart from 'src/views/charts/print-charts/ChartjsPolarAreaChart'
import ChartjsTable from 'src/views/charts/print-charts/ChartjsTable'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ChartJS = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [tableData, setTableData] = useState([])
  const [shareOfVoiceData, setShareOfVoiceData] = useState([])

  const handleDateRangeChange = range => {
    setSelectedDateRange(range)

    const filteredArticles = filterArticlesByDateRange(articles, range)
    const newTableData = countArticlesByCompany(filteredArticles)
    const newShareOfVoiceData = calculateShareOfVoice(filteredArticles)

    setTableData(newTableData)
    setShareOfVoiceData(newShareOfVoiceData)
  }

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

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h4'>
              <LinkStyled href='https://github.com/reactchartjs/react-chartjs-2' target='_blank'>
                Print Dashboard
              </LinkStyled>
            </Typography>
          }
          subtitle={<Typography sx={{ color: 'text.secondary' }}>React wrapper for Chart.js</Typography>}
        />
        <Grid item xs={12}>
          <ArticleCountDistribution companyData={calculateArticleCountsByCompany(articles)} />
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
          <ChartsAppBar handleDateRangeChange={handleDateRangeChange} />
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Pass color variables as props */}
          <ChartjsPolarAreaChart
            shareOfVoiceData={shareOfVoiceData}
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
          <ChartjsTable tableData={tableData} />
        </Grid>
        <Grid item xs={12}>
          <ChartjsBarChart
            companyData={tableData} // Pass the company data to the bar chart
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
