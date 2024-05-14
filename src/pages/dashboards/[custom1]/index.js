// ** MUI Import
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

// ** redux import
import { useSelector } from 'react-redux'
import { selectSelectedMedia, customDashboardsScreensWithCharts } from 'src/store/apps/user/userSlice'

// ** data fetch hooks
import useChartsData from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useChartsData'
import useVisibilityRanking from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useVisibilityRanking'
import usePublicationVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/usePublicationVisibility'
import usePublicationClientVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/usePublicationClientVisibility'
import useSubjectVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useSubjectVisibility'
import useReportingSubjectVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useSubjectClientVisiblity'
import useJournalistVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useJournalistVisibility'
import useJournalistClientVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useJournalistClientVisibility'
import useVisibilityCount from 'src/api/dashboard-visibilityCount/useVisibilityCount'
import useJournalistVscore from 'src/api/dashboard-visibilityCount/useJournalistVscore'
import useTonality from 'src/api/dashboard-tonality/useCompanyTonality'
import usePerformanceData from 'src/api/dashboard-performance/usePerformance'
import usePeersData from 'src/api/dashboard-peers/usePeersData'

import MultipleCharts from 'src/views/dashboards/visibilityImageQe/AnalyticsMultipleCharts'
import VisibilityRanking from 'src/views/dashboards/visibilityImageQe/AnalyticsVisibilityRanking'
import PublicationVisibility from 'src/views/dashboards/visibilityImageQe/AnalyticsPublicationVisibility'
import AnalyticsPublicationClient from 'src/views/dashboards/visibilityImageQe/AnalyticsPublicationClient'
import AnalyticsSubject from 'src/views/dashboards/visibilityImageQe/AnalyticsSubject'
import AnalyticsSubjectClient from 'src/views/dashboards/visibilityImageQe/AnalyticsSubjectClient'
import AnalyticsJournalist from 'src/views/dashboards/visibilityImageQe/AnalyticsJournalist'
import AnalyticsJournalistClient from 'src/views/dashboards/visibilityImageQe/AnalyticsJournalistClient'
import VolumeRanking from 'src/views/dashboards/visibility&Count/VolumeRanking'
import SubjectVscore from 'src/views/dashboards/visibility&Count/SubjectVscore'
import JournalistVscore from 'src/views/dashboards/visibility&Count/JournalistVscore'

import ReportPeers from 'src/views/dashboards/peers/ReportsPeers'
import VisibilityPeers from 'src/views/dashboards/peers/VisibilityPeersData'
import Region from 'src/views/dashboards/performance/Region'
import Reportings from 'src/views/dashboards/performance/Reportings'
import Publication from 'src/views/dashboards/performance/Publication'
import Journalist from 'src/views/dashboards/performance/Journalist'
import { Language } from '@mui/icons-material'
import { useEffect, useState } from 'react'

//**  components
const CustomDashboard = () => {
  const selectedMedia = useSelector(selectSelectedMedia)
  const chartList = useSelector(customDashboardsScreensWithCharts)

  const [charts, setCharts] = useState([])

  useEffect(() => {
    const localV = chartList.length && chartList.map(i => i.id)
    setCharts(localV || [])
  }, [chartList])

  const router = useRouter()
  const { custom1 } = router.query

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

  // ** data hooks

  const {
    chartData: companyVisibility,
    loading: companyLoading,
    error: companyError
  } = useChartsData({ media: selectedMedia, endpoint: '/companyVisibility/' })

  const {
    chartData: visibilityRanking,
    loading: rankingLoading,
    error: rankingError
  } = useVisibilityRanking({ media: selectedMedia, endpoint: '/visibilityRanking/' })

  const {
    chartData: publicationVisibility,
    loading: visibilityLoading,
    error: visibilityError
  } = usePublicationVisibility({ media: selectedMedia, endpoint: '/publicationsVisibility/' })

  const {
    chartData: publicationClientVisibility,
    loading: publicationClientLoading,
    error: publicationClientError
  } = usePublicationClientVisibility({ media: selectedMedia, endpoint: '/publicationsClientVisibility/' })

  const {
    chartData: subjectVisibility,
    loading: subjectLoading,
    error: subjectError
  } = useSubjectVisibility({ media: selectedMedia, endpoint: '/reportingSubjectVisibility/' })

  const {
    chartData: subjectClientVisibility,
    loading: subjectClientLoading,
    error: subjectClientError
  } = useReportingSubjectVisibility({ media: selectedMedia, endpoint: '/reportingSubjectClientVisibility/' })

  const {
    chartData: journalistVisibility,
    loading: journalistLoading,
    error: journalistError
  } = useJournalistVisibility({ media: selectedMedia, endpoint: '/journalistVisibility/' })

  const {
    chartData: journalistClientVisibility,
    loading: journalistClientLoading,
    error: journalistClientError
  } = useJournalistClientVisibility({ media: selectedMedia, endpoint: '/journalistClientVisibility/' })

  const {
    chartData: volumeRankingData,
    loading: volumeRankingLoading,
    error: volumeRankingError
  } = useVisibilityCount({ media: selectedMedia, endpoint: '/volumeRanking/' })

  const {
    chartData: subjectVscoreData,
    loading: subjectVscoreLoading,
    error: subjectVscoreError
  } = useVisibilityCount({ media: selectedMedia, endpoint: '/reportingSubjectVscore/' })

  const {
    chartData: journalistVscoreData,
    loading: journalistVscoreLoading,
    error: journalistVscoreError
  } = useJournalistVscore({ media: selectedMedia, endpoint: '/journalistVscore/' })

  const {
    chartData: reportPeersData,
    loading: reportPeersDataLoading,
    error: reportPeersDataError
  } = usePeersData({ media: selectedMedia, endpoint: '/reportPeers/', idType: 'clientIds', isCompanyIds: true })

  const {
    chartData: visibilityPeersData,
    loading: visibilityPeersDataLoading,
    error: visibilityPeersDataError
  } = usePeersData({ media: selectedMedia, endpoint: '/visibilityPeers/', idType: 'clientIds', isCompanyIds: true })

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

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {charts.includes('CompanyVisibility') && (
          <Grid item xs={12} lg={6}>
            {' '}
            <MultipleCharts
              chartData={companyVisibility}
              loading={companyLoading}
              error={companyError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('VisibilityRanking') && (
          <Grid item xs={12} lg={6}>
            <VisibilityRanking
              chartData={visibilityRanking}
              loading={rankingLoading}
              error={rankingError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('PublicationVisibility') && (
          <Grid item xs={12} lg={6}>
            <PublicationVisibility
              chartData={publicationVisibility}
              loading={visibilityLoading}
              error={visibilityError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('AnalyticsPublicationClient') && (
          <Grid item xs={12} lg={6}>
            <AnalyticsPublicationClient
              chartData={publicationClientVisibility}
              loading={publicationClientLoading}
              error={publicationClientError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('AnalyticsSubject') && (
          <Grid item xs={12} lg={6}>
            <AnalyticsSubject
              chartData={subjectVisibility}
              loading={subjectLoading}
              error={subjectError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('AnalyticsSubjectClient') && (
          <Grid item xs={12} lg={6}>
            <AnalyticsSubjectClient
              chartData={subjectClientVisibility}
              loading={subjectClientLoading}
              error={subjectClientError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('AnalyticsJournalist') && (
          <Grid item xs={12} lg={6}>
            <AnalyticsJournalist
              chartData={journalistVisibility}
              loading={journalistLoading}
              error={journalistError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('AnalyticsJournalistClient') && (
          <Grid item xs={12} lg={6}>
            <AnalyticsJournalistClient
              chartData={journalistClientVisibility}
              loading={journalistClientLoading}
              error={journalistClientError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('VolumeRanking') && (
          <Grid item xs={12} lg={6}>
            <VolumeRanking
              chartData={volumeRankingData}
              loading={volumeRankingLoading}
              error={volumeRankingError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('SubjectVscore') && (
          <Grid item xs={12} lg={6}>
            <SubjectVscore
              chartData={subjectVscoreData}
              loading={subjectVscoreLoading}
              error={subjectVscoreError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('JournalistVscore') && (
          <Grid item xs={12} lg={6}>
            <JournalistVscore
              chartData={journalistVscoreData}
              loading={journalistVscoreLoading}
              error={journalistVscoreError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('ReportPeers') && (
          <Grid item xs={12} lg={6}>
            <ResizableBox
              width={300} // Initial width
              height={200} // Initial height
              minConstraints={[100, 100]} // Minimum width and height
              maxConstraints={[500, 500]} // Maximum width and height
              resizeHandles={['se']} // Resize handles (southeast)
            >
              <ReportPeers
                chartData={reportPeersData}
                loading={reportPeersDataLoading}
                error={reportPeersDataError}
                legendColor={legendColor}
                primary={primaryColor}
                yellow={yellowColor}
                warning={lineChartWarning}
                info={polarChartInfo}
                grey={polarChartGrey}
                green={polarChartGreen}
              />
            </ResizableBox>
          </Grid>
        )}
        {charts.includes('VisibilityPeers') && (
          <Grid item xs={12} lg={6}>
            <VisibilityPeers
              chartData={visibilityPeersData}
              loading={visibilityPeersDataLoading}
              error={visibilityPeersDataError}
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
        )}
        {charts.includes('Region') && (
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
        )}
        {charts.includes('Reportings') && (
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
        )}
        {charts.includes('Publication') && (
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
        )}
        {charts.includes('Journalist') && (
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
        )}
        {charts.includes('Language') && (
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
        )}
      </Grid>
    </ApexChartWrapper>
  )
}

export default CustomDashboard
