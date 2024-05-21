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
import PublicationPerformance from 'src/views/dashboards/publication/Publication'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const PublicationCharts = () => {
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
    chartData: publicationPerformanceNDData,
    loading: publicationPerformanceNDDataLoading,
    error: publicationPerformanceNDDataError
  } = useFetchReports({
    endpoint: '/publicationPerformanceND/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'publicationPerformanceND'
  })

  const {
    chartData: publicationPerformanceBDData,
    loading: publicationPerformanceBDDataLoading,
    error: publicationPerformanceBDDataError
  } = useFetchReports({
    endpoint: '/publicationPerformanceBD/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'publicationPerformanceBD'
  })

  const {
    chartData: publicationPerformanceRDData,
    loading: publicationPerformanceRDDataLoading,
    error: publicationPerformanceRDDataError
  } = useFetchReports({
    endpoint: '/publicationPerformanceRD/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'publicationPerformanceRD'
  })

  const {
    chartData: publicationPerformanceMagazineData,
    loading: publicationPerformanceMagazineDataLoading,
    error: publicationPerformanceMagazineDataError
  } = useFetchReports({
    endpoint: '/publicationPerformanceMagazine/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'publicationPerformanceMagazine'
  })

  const {
    chartData: publicationPerformanceOnlineTop10Data,
    loading: publicationPerformanceOnlineTop10DataLoading,
    error: publicationPerformanceOnlineTop10DataError
  } = useFetchReports({
    endpoint: '/publicationPerformanceOnlineTop10/',
    idType: 'clientIds',
    isMedia: false,
    dataKey: 'publicationPerformanceOnlineTop10'
  })

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <PublicationPerformance
            chartData={publicationPerformanceNDData}
            loading={publicationPerformanceNDDataLoading}
            error={publicationPerformanceNDDataError}
            cardTitle='publicationND'
            chartId='publication-nd'
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
          <PublicationPerformance
            chartData={publicationPerformanceBDData}
            loading={publicationPerformanceBDDataLoading}
            error={publicationPerformanceBDDataError}
            cardTitle='publicationBD'
            chartId='publication-bd'
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
          <PublicationPerformance
            chartData={publicationPerformanceRDData}
            loading={publicationPerformanceRDDataLoading}
            error={publicationPerformanceRDDataError}
            cardTitle='publicationRD'
            chartId='publication-rd'
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
          <PublicationPerformance
            chartData={publicationPerformanceMagazineData}
            loading={publicationPerformanceMagazineDataLoading}
            error={publicationPerformanceMagazineDataError}
            cardTitle='publicationMagazine'
            chartId='publication-mg'
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
          <PublicationPerformance
            chartData={publicationPerformanceOnlineTop10Data}
            loading={publicationPerformanceOnlineTop10DataLoading}
            error={publicationPerformanceOnlineTop10DataError}
            cardTitle='publicationTop10'
            chartId='publication-top-10'
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

export default PublicationCharts
