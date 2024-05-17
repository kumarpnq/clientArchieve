// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** redux import
import { useSelector } from 'react-redux'
import { selectUserData, selectSelectedMedia } from 'src/store/apps/user/userSlice'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import useFetchReports from 'src/api/dashboard/useFetchReports'
import JournalistND from 'src/views/dashboards/journalist/JournalistND'
import JournalistPerformance from 'src/views/dashboards/journalist/JournalistND'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const JournalistCharts = () => {
  // ** Hook
  const theme = useTheme()

  // * Vars
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

  // ** data hooks
  const {
    chartData: journalistPerformanceNDData,
    loading: journalistPerformanceNDDataLoading,
    error: journalistPerformanceNDDataError
  } = useFetchReports({
    endpoint: '/journalistPerformanceND/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'journalistPerformanceND'
  })

  const {
    chartData: journalistPerformanceBDData,
    loading: journalistPerformanceBDDataLoading,
    error: journalistPerformanceBDDataError
  } = useFetchReports({
    endpoint: '/journalistPerformanceBD/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'journalistPerformanceBD'
  })

  const {
    chartData: journalistPerformanceRDData,
    loading: journalistPerformanceRDDataLoading,
    error: journalistPerformanceRDDataError
  } = useFetchReports({
    endpoint: '/journalistPerformanceRD/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'journalistPerformanceRD'
  })

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <JournalistPerformance
            chartData={journalistPerformanceNDData}
            loading={journalistPerformanceNDDataLoading}
            error={journalistPerformanceNDDataError}
            cardTitle='JournalistND'
            chartId='journalist-nd'
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {' '}
          <JournalistPerformance
            chartData={journalistPerformanceRDData}
            loading={journalistPerformanceRDDataLoading}
            error={journalistPerformanceRDDataError}
            cardTitle='JournalistRD'
            chartId='journalist-rd'
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {' '}
          <JournalistPerformance
            chartData={journalistPerformanceBDData}
            loading={journalistPerformanceBDDataLoading}
            error={journalistPerformanceBDDataError}
            cardTitle='JournalistBD'
            chartId='journalist-bd'
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default JournalistCharts
