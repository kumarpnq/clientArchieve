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

// ** hooks
// import useScreenPermissions from 'src/hooks/useScreenPermissions'
import usePerformanceData from 'src/api/dashboard-performance/usePerformance'

// * components import
import Region from 'src/views/dashboards/performance/Region'
import Publication from 'src/views/dashboards/performance/Publication'
import Reportings from 'src/views/dashboards/performance/Reportings'
import Journalist from 'src/views/dashboards/performance/Journalist'
import Language from 'src/views/dashboards/performance/Language'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const PeersCharts = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

  // * data hooks
  const {
    chartData: regionPerformanceData,
    loading: regionPerformanceDataLoading,
    error: regionPerformanceDataError
  } = usePerformanceData({
    media: selectedMedia,
    endpoint: '/regionPerformance/',
    idType: 'clientIds',
    isCompanyIds: true
  })

  const {
    chartData: publicationPerformanceData,
    loading: publicationPerformanceDataLoading,
    error: publicationPerformanceDataError
  } = usePerformanceData({
    media: selectedMedia,
    endpoint: '/publicationPerformance/',
    idType: 'clientIds',
    isCompanyIds: true
  })

  const {
    chartData: reporingPerformanceData,
    loading: reporingPerformanceDataLoading,
    error: reporingPerformanceDataError
  } = usePerformanceData({
    media: selectedMedia,
    endpoint: '/reporingPerformance/',
    idType: 'clientIds',
    isCompanyIds: true
  })

  const {
    chartData: journalistPerformanceData,
    loading: journalistPerformanceDataLoading,
    error: journalistPerformanceDataError
  } = usePerformanceData({
    media: selectedMedia,
    endpoint: '/journalistPerformance/',
    idType: 'clientIds',
    isCompanyIds: true
  })

  const {
    chartData: languagePerformanceData,
    loading: languagePerformanceDataLoading,
    error: languagePerformanceDataError
  } = usePerformanceData({
    media: selectedMedia,
    endpoint: '/languagePerformance/',
    idType: 'clientIds',
    isCompanyIds: true
  })

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

  // const screenPermissions = useScreenPermissions()
  // const hasAccess = screenPermissions['tonality']

  // if (!hasAccess) {
  //   return <div>You don't have access to this page.</div>
  // }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <Region
            regionData={regionPerformanceData}
            loading={regionPerformanceDataLoading}
            error={regionPerformanceDataError}
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
          <Reportings
            reportingData={reporingPerformanceData}
            loading={reporingPerformanceDataLoading}
            error={reporingPerformanceDataError}
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} lg={16}>
          <Publication
            publicationData={publicationPerformanceData}
            loading={publicationPerformanceDataLoading}
            error={publicationPerformanceDataError}
            legendColor={legendColor}
            primary={primaryColor}
            yellow={yellowColor}
            warning={lineChartWarning}
            info={polarChartInfo}
            grey={polarChartGrey}
            green={polarChartGreen}
          />
        </Grid>
        <Grid item xs={12} lg={16}>
          <Journalist
            journalistData={journalistPerformanceData}
            loading={journalistPerformanceDataLoading}
            error={journalistPerformanceDataError}
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
          <Language
            languageData={languagePerformanceData}
            loading={languagePerformanceDataLoading}
            error={languagePerformanceDataError}
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

export default PeersCharts
