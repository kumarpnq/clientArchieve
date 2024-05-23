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
import useFetchReports from 'src/api/dashboard/useFetchReports'
import useConditionalFetchReports from 'src/api/custom/useConditionalFetchReports'
import useVisibilityCount from 'src/api/dashboard-visibilityCount/useVisibilityCount'
import useJournalistVscore from 'src/api/dashboard-visibilityCount/useJournalistVscore'
import usePeersData from 'src/api/dashboard-peers/usePeersData'

//**  components
import MultipleCharts from 'src/views/dashboards/visibilityImageQe/AnalyticsMultipleCharts'
import VisibilityRanking from 'src/views/dashboards/visibilityImageQe/AnalyticsVisibilityRanking'
import VolumeRanking from 'src/views/dashboards/visibility&Count/VolumeRanking'
import SubjectVscore from 'src/views/dashboards/visibility&Count/SubjectVscore'
import JournalistVscore from 'src/views/dashboards/visibility&Count/JournalistVscore'
import ReportPeers from 'src/views/dashboards/peers/ReportsPeers'
import VisibilityPeers from 'src/views/dashboards/peers/VisibilityPeersData'

import { useEffect, useState } from 'react'
import PerformanceShortChart from 'src/views/dashboards/performance/Region'
import PerformanceLongCharts from 'src/views/dashboards/performance/Publication'

const CustomDashboard = () => {
  const selectedMedia = useSelector(selectSelectedMedia)
  const chartList = useSelector(customDashboardsScreensWithCharts)

  const [charts, setCharts] = useState([])
  console.log(chartList)

  useEffect(() => {
    const localV = chartList.length && chartList.map(i => i.id)
    setCharts(localV || [])
  }, [chartList])

  const router = useRouter()
  const { custom1 } = router.query

  // ** Hook
  const theme = useTheme()
  const { query, asPath } = router

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

  // ** chart access
  const companyVisibilityAccess = charts.includes('companyVisibility')
  const visibilityRankingAccess = charts.includes('VisibilityRanking')
  const PublicationVisibilityAccess = charts.includes('publicationVisibility')
  const PublicationClientVisibilityAccess = charts.includes('publicationClientVisibility')
  const reportingSubjectVisibilityAccess = charts.includes('reportingSubjectVisibility')
  const reportingSubjectClientVisibilityAccess = charts.includes('reportingSubjectClientVisibility')
  const journalistVisibilityAccess = charts.includes('journalistVisibility')
  const journalistClientVisibilityAccess = charts.includes('journalistVisibility')
  const regionPerformanceAccess = charts.includes('regionPerformance')
  const publicationPerformanceAccess = charts.includes('publicationPerformance')
  const reportingPerformanceAccess = charts.includes('reportingPerformance')
  const journalistPerformanceAccess = charts.includes('journalistPerformance')

  // ** data hooks

  const {
    chartData: companyVisibility,
    loading: companyLoading,
    error: companyError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/companyVisibility/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'companyVisibility',
    isFetch: companyVisibilityAccess
  })

  const {
    chartData: visibilityRanking,
    loading: rankingLoading,
    error: rankingError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/visibilityRanking/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'visibilityRanking',
    isFetch: visibilityRankingAccess
  })

  const {
    chartData: publicationVisibility,
    loading: visibilityLoading,
    error: visibilityError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/publicationsVisibility/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'publicationsVisibility',
    isFetch: PublicationVisibilityAccess
  })

  const {
    chartData: publicationClientVisibility,
    loading: publicationClientLoading,
    error: publicationClientError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/publicationsClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'publicationsClientVisibility',
    isFetch: PublicationClientVisibilityAccess
  })

  const {
    chartData: subjectVisibility,
    loading: subjectLoading,
    error: subjectError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/reportingSubjectVisibility/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'reportingSubjectVisibility',
    isFetch: reportingSubjectVisibilityAccess
  })

  const {
    chartData: subjectClientVisibility,
    loading: subjectClientLoading,
    error: subjectClientError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/reportingSubjectClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'reportingSubjectClientVisibility',
    isFetch: reportingSubjectClientVisibilityAccess
  })

  const {
    chartData: journalistVisibility,
    loading: journalistLoading,
    error: journalistError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/journalistVisibility/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'journalistVisibility',
    isFetch: journalistVisibilityAccess
  })

  const {
    chartData: journalistClientVisibility,
    loading: journalistClientLoading,
    error: journalistClientError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/journalistClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    isCompanyIds: false,
    dataKey: 'journalistClientVisibility',
    isFetch: journalistClientVisibilityAccess
  })

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
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    endpoint: '/regionPerformance/',
    dataKey: 'regionPerformance',
    isFetch: regionPerformanceAccess
  })

  const {
    chartData: publicationPerformanceData,
    loading: publicationPerformanceDataLoading,
    error: publicationPerformanceDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    endpoint: '/publicationPerformance/',
    dataKey: 'publicationPerformance',
    isFetch: publicationPerformanceAccess
  })

  const {
    chartData: reporingPerformanceData,
    loading: reporingPerformanceDataLoading,
    error: reporingPerformanceDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    isMedia: true,
    isCompanyIds: false,
    idType: 'clientIds',
    endpoint: '/reportingPerformance/',
    dataKey: 'reportingPerformance',
    isFetch: reportingPerformanceAccess
  })

  const {
    chartData: journalistPerformanceData,
    loading: journalistPerformanceDataLoading,
    error: journalistPerformanceDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: false,
    endpoint: '/journalistPerformance/',
    dataKey: 'journalistPerformance',
    isFetch: reportingPerformanceAccess
  })

  const {
    chartData: languagePerformanceData,
    loading: languagePerformanceDataLoading,
    error: languagePerformanceDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/languagePerformance/',
    dataKey: 'languagePerformance',
    isMedia: true,
    isFetch: journalistPerformanceAccess
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
              chartTitle='Company Visibility'
              chartId='company-visibility'
              dataAccessKey='companyName'
              reportId='companyVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={publicationVisibility}
              loading={visibilityLoading}
              error={visibilityError}
              chartTitle='Publications Visibility'
              chartId='publications-visibility'
              dataAccessKey='publicationGroupName'
              reportId='publicationsVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={publicationClientVisibility}
              loading={publicationClientLoading}
              error={publicationClientError}
              chartTitle='Publications Client Visibility'
              chartId='publications-client-visibility'
              dataAccessKey='publicationGroupName'
              reportId='publicationsClientVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={subjectVisibility}
              loading={subjectLoading}
              error={subjectError}
              chartTitle='Reporting Subject Visibility'
              chartId='reporting-subject-visibility'
              dataAccessKey='reportingSubject'
              reportId='reportingSubjectVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={subjectClientVisibility}
              loading={subjectClientLoading}
              error={subjectClientError}
              chartTitle='Reporting Subject Client Visibility'
              chartId='reporting-subject-client-visibility'
              dataAccessKey='reportingSubject'
              reportId='reportingSubjectClientVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={journalistVisibility}
              loading={journalistLoading}
              error={journalistError}
              chartTitle='Journalist Visibility'
              chartId='journalist-visibility'
              dataAccessKey='journalist'
              reportId='journalistVisibility'
              path={asPath}
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
            <MultipleCharts
              chartData={journalistClientVisibility}
              loading={journalistClientLoading}
              error={journalistClientError}
              chartTitle='Journalist Client Visibility'
              chartId='journalist-client-visibility'
              dataAccessKey='journalist'
              reportId='journalistClientVisibility'
              path={asPath}
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
            <PerformanceShortChart
              regionData={regionPerformanceData}
              loading={regionPerformanceDataLoading}
              error={regionPerformanceDataError}
              chartTitle='Region'
              chartId='region-performance'
              reportId='regionPerformance'
              path={asPath}
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
            <PerformanceShortChart
              regionData={reportingPerformanceData}
              loading={reportingPerformanceDataLoading}
              error={reportingPerformanceDataError}
              chartTitle='Reporting'
              chartId='reporting-performance'
              reportId='reportingPerformance'
              path={asPath}
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
            <PerformanceLongCharts
              publicationData={publicationPerformanceData}
              loading={publicationPerformanceDataLoading}
              error={publicationPerformanceDataError}
              chartTitle='Publication'
              chartId='publication-performance'
              reportId='publicationPerformance'
              path={asPath}
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
            <PerformanceLongCharts
              publicationData={journalistPerformanceData}
              loading={journalistPerformanceDataLoading}
              error={journalistPerformanceDataError}
              chartTitle='Journalist'
              chartId='journalist-performance'
              reportId='journalistPerformance'
              path={asPath}
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
            <PerformanceShortChart
              regionData={languagePerformanceData}
              loading={languagePerformanceDataLoading}
              error={languagePerformanceDataError}
              chartTitle='Language'
              chartId='language-performance'
              reportId='languagePerformance'
              path={asPath}
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
