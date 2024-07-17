'use client'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useEffect, useState } from 'react'

// ** MUI Import
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

// ** redux import
import { useSelector } from 'react-redux'
import {
  selectSelectedMedia,
  customDashboardsScreensWithCharts,
  setUserDashboardId
} from 'src/store/apps/user/userSlice'

// ** data fetch hooks
import useConditionalFetchReports from 'src/api/custom/useConditionalFetchReports'

//**  components
import MultipleCharts from 'src/views/dashboards/visibilityImageQe/AnalyticsMultipleCharts'
import VisibilityRanking from 'src/views/dashboards/visibilityImageQe/AnalyticsVisibilityRanking'
import VolumeRanking from 'src/views/dashboards/visibility&Count/VolumeRanking'
import SubjectVscore from 'src/views/dashboards/visibility&Count/SubjectVscore'
import JournalistVscore from 'src/views/dashboards/visibility&Count/JournalistVscore'
import ReportPeers from 'src/views/dashboards/peers/ReportsPeers'
import VisibilityPeers from 'src/views/dashboards/peers/VisibilityPeersData'

import PerformanceShortChart from 'src/views/dashboards/performance/Region'
import PerformanceLongCharts from 'src/views/dashboards/performance/Publication'
import RankingKpiPeersCharts from 'src/views/dashboards/kpi-peers/RankingKpiPeersWithVisibility'
import PublicationPerformance from 'src/views/dashboards/publication/Publication'
import JournalistPerformance from 'src/views/dashboards/journalist/JournalistND'
import { useDispatch } from 'react-redux'
import CompanyTonality from 'src/views/dashboards/tonality/CompanyTonality'
import TonalityVScore from 'src/views/dashboards/tonality/TonalityVScore'
import ClientTonality from 'src/views/dashboards/tonality/ClientTonality'
import PositiveTonality from 'src/views/dashboards/tonality/PositiveTonality'
import NegativeTonality from 'src/views/dashboards/tonality/NegativeTonality'

const CustomDashboard = () => {
  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const { query, asPath } = router

  const reversedPath = asPath
    .split('/')
    .filter(part => part !== 'dashboards')
    .map(part => part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())) // Capitalize each word
    .join(' ')
    .trim()
  const selectedMedia = useSelector(selectSelectedMedia)
  const chartList = useSelector(customDashboardsScreensWithCharts)
  const dispatch = useDispatch()

  const [charts, setCharts] = useState([])

  useEffect(() => {
    const selectedDashboard = chartList && chartList?.find(item => item.userDashboardName === reversedPath)

    const reportList = selectedDashboard?.reportList || []
    const reportIds = reportList.map(report => report.reportId)
    const userDashboardId = selectedDashboard?.userDashboardId || null
    dispatch(setUserDashboardId(userDashboardId))
    setCharts(reportIds)
  }, [chartList, reversedPath, dispatch])

  // const { custom1 } = router.query

  // Vars

  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const polarChartGreen = '#28dac6'
  const lineChartWarning = '#ff9800'
  const legendColor = theme.palette.text.secondary

  // ** chart access
  // * visibility image qe
  const companyVisibilityAccess = charts.includes('companyVisibility')
  const visibilityRankingAccess = charts.includes('VisibilityRanking')
  const PublicationVisibilityAccess = charts.includes('publicationsVisibility')
  const PublicationClientVisibilityAccess = charts.includes('publicationsClientVisibility')
  const reportingSubjectVisibilityAccess = charts.includes('reportingSubjectVisibility')
  const reportingSubjectClientVisibilityAccess = charts.includes('reportingSubjectClientVisibility')
  const journalistVisibilityAccess = charts.includes('journalistVisibility')
  const journalistClientVisibilityAccess = charts.includes('journalistClientVisibility')

  // * performance
  const regionPerformanceAccess = charts.includes('regionPerformance')
  const publicationPerformanceAccess = charts.includes('publicationPerformance')
  const reportingPerformanceAccess = charts.includes('reportingPerformance')
  const journalistPerformanceAccess = charts.includes('journalistPerformance')
  const languagePerformanceAccess = charts.includes('languagePerformance')

  //* visibility count
  const volumeRankingPermission = charts.includes('volumeRanking')
  const reportingSubjectPermission = charts.includes('reportingSubjectVscore')
  const journalistVscorePermission = charts.includes('journalistVscore')

  // * report peers
  const reportPeersPermission = charts.includes('reportPeers')
  const visibilityPeersPermission = charts.includes('visibilityPeers')

  // * kpi peers
  const rankingKpiPeersPermission = charts.includes('rankingKPIPeers')
  const rankingKpiPeersWithVisibilityPeersPermission = charts.includes('rankingKPiPeersWithVisibility')

  // * publication
  const publicationNDAccess = charts.includes('publicationPerformanceND')
  const publicationBDAccess = charts.includes('publicationPerformanceBD')
  const publicationRDAccess = charts.includes('publicationPerformanceRD')
  const publicationPerformanceMagazineAccess = charts.includes('publicationPerformanceMagazine')
  const publicationPerformanceOnlineTop10Access = charts.includes('publicationPerformanceOnlineTop10')

  // * journalist
  const journalistPerformanceNDPermission = charts.includes('journalistPerformanceND')
  const journalistPerformanceBDPermission = charts.includes('journalistPerformanceBD')
  const journalistPerformanceRDPermission = charts.includes('journalistPerformanceRD')

  // * tonality
  const companyTonalityPermission = charts.includes('companyTonality')
  const tonalityVscorePermission = charts.includes('tonalityVscore')
  const clientTonalityPermission = charts.includes('clientTonality')
  const positiveTonalityPermission = charts.includes('positiveTonality')
  const negativeTonalityPermission = charts.includes('negativeTonality')

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
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/volumeRanking/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: true,
    dataKey: 'volumeRanking',
    isFetch: volumeRankingPermission
  })

  const {
    chartData: subjectVscoreData,
    loading: subjectVscoreLoading,
    error: subjectVscoreError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/reportingSubjectVscore/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: true,
    dataKey: 'reportingSubjectVscore',
    isFetch: reportingSubjectPermission
  })

  const {
    chartData: journalistVscoreData,
    loading: journalistVscoreLoading,
    error: journalistVscoreError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/journalistVscore/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: true,
    dataKey: 'journalistVscore',
    isFetch: journalistVscorePermission
  })

  const {
    chartData: reportPeersData,
    loading: reportPeersDataLoading,
    error: reportPeersDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/reportPeers/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: true,
    dataKey: 'reportPeers.print',
    isFetch: reportPeersPermission
  })

  const {
    chartData: visibilityPeersData,
    loading: visibilityPeersDataLoading,
    error: visibilityPeersDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    endpoint: '/visibilityPeers/',
    idType: 'clientIds',
    isMedia: true,
    isCompanyIds: true,
    dataKey: 'visibilityPeers.print',
    isFetch: visibilityPeersPermission
  })

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
    chartData: reportingPerformanceData,
    loading: reportingPerformanceDataLoading,
    error: reportingPerformanceDataError
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

  // * kpi peers
  const {
    chartData: rankingKpiData,
    loading: rankingKpiDataLoading,
    error: rankingKpiDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/rankingKpiPeers/',
    dataKey: 'rankingKpiPeers?.print',
    isMedia: false,
    isFetch: rankingKpiPeersPermission
  })

  const {
    chartData: rankingKpiVisibilityData,
    loading: rankingKpiVisibilityDataLoading,
    error: rankingKpiVisibilityDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/rankingKpiPeersWithVisibility/',
    dataKey: 'rankingKpiPeersWithVisibility?.print',
    isMedia: false,
    isFetch: rankingKpiPeersWithVisibilityPeersPermission
  })

  // * publication
  const {
    chartData: publicationPerformanceNDData,
    loading: publicationPerformanceNDDataLoading,
    error: publicationPerformanceNDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/publicationPerformanceND/',
    dataKey: 'publicationPerformanceND',
    isMedia: false,
    isFetch: publicationNDAccess
  })

  const {
    chartData: publicationPerformanceBDData,
    loading: publicationPerformanceBDDataLoading,
    error: publicationPerformanceBDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/publicationPerformanceBD/',
    dataKey: 'publicationPerformanceBD',
    isMedia: false,
    isFetch: publicationBDAccess
  })

  const {
    chartData: publicationPerformanceRDData,
    loading: publicationPerformanceRDDataLoading,
    error: publicationPerformanceRDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/publicationPerformanceRD/',
    dataKey: 'publicationPerformanceRD',
    isMedia: false,
    isFetch: publicationRDAccess
  })

  const {
    chartData: publicationPerformanceMagazineData,
    loading: publicationPerformanceMagazineDataLoading,
    error: publicationPerformanceMagazineDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/publicationPerformanceMagazine/',
    dataKey: 'publicationPerformanceMagazine',
    isMedia: false,
    isFetch: publicationPerformanceMagazineAccess
  })

  const {
    chartData: publicationPerformanceOnlineTop10Data,
    loading: publicationPerformanceOnlineTop10DataLoading,
    error: publicationPerformanceOnlineTop10DataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/publicationPerformanceOnlineTop10/',
    dataKey: 'publicationPerformanceOnlineTop10',
    isMedia: false,
    isFetch: publicationPerformanceOnlineTop10Access
  })

  // * journalist
  const {
    chartData: journalistPerformanceNDData,
    loading: journalistPerformanceNDDataLoading,
    error: journalistPerformanceNDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/journalistPerformanceND/',
    dataKey: 'journalistPerformanceND',
    isMedia: false,
    isFetch: journalistPerformanceNDPermission
  })

  const {
    chartData: journalistPerformanceBDData,
    loading: journalistPerformanceBDDataLoading,
    error: journalistPerformanceBDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/journalistPerformanceBD/',
    dataKey: 'journalistPerformanceBD',
    isMedia: false,
    isFetch: journalistPerformanceBDPermission
  })

  const {
    chartData: journalistPerformanceRDData,
    loading: journalistPerformanceRDDataLoading,
    error: journalistPerformanceRDDataError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/journalistPerformanceRD/',
    dataKey: 'journalistPerformanceRD',
    isMedia: false,
    isFetch: journalistPerformanceRDPermission
  })

  // * tonality
  const {
    chartData: companyTonalityData,
    loading: companyTonalityLoading,
    error: companyTonalityError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/companyTonality/',
    dataKey: 'companyTonality',
    isMedia: true,
    isFetch: companyTonalityPermission
  })

  const {
    chartData: tonalityVScoreData,
    loading: tonalityVScoreLoading,
    error: tonalityVScoreError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/tonalityVscore/',
    dataKey: 'tonalityVscore',
    isMedia: true,
    isFetch: tonalityVscorePermission
  })

  const {
    chartData: clientTonality,
    loading: clientTonalityLoading,
    error: clientTonalityError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/clientTonality/',
    dataKey: 'clientTonality',
    isMedia: true,
    isFetch: clientTonalityPermission
  })

  const {
    chartData: positiveTonality,
    loading: positiveTonalityLoading,
    error: positiveTonalityError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/positiveTonality/',
    dataKey: 'positiveTonality',
    isMedia: true,
    isFetch: positiveTonalityPermission
  })

  const {
    chartData: negativeTonality,
    loading: negativeTonalityLoading,
    error: negativeTonalityError
  } = useConditionalFetchReports({
    media: selectedMedia,
    idType: 'clientIds',
    endpoint: '/negativeTonality/',
    dataKey: 'negativeTonality',
    isMedia: true,
    isFetch: negativeTonalityPermission
  })

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {!charts.length ? (
          <Grid item xs={12} lg={6}>
            No Chart Found.
          </Grid>
        ) : (
          <Fragment>
            {' '}
            {companyVisibilityAccess && (
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
            {visibilityRankingAccess && (
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
            {PublicationVisibilityAccess && (
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
            {PublicationClientVisibilityAccess && (
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
            {reportingSubjectVisibilityAccess && (
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
            {reportingSubjectClientVisibilityAccess && (
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
            {journalistVisibilityAccess && (
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
            {journalistClientVisibilityAccess && (
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
            {volumeRankingPermission && (
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
            {reportingSubjectPermission && (
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
            {journalistVscorePermission && (
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
            {reportPeersPermission && (
              <Grid item xs={12} lg={6}>
                <ResizableBox
                  width={300}
                  height={200}
                  minConstraints={[100, 100]}
                  maxConstraints={[500, 500]}
                  resizeHandles={['se']}
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
            {visibilityPeersPermission && (
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
            {regionPerformanceAccess && (
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
            {reportingPerformanceAccess && (
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
            {publicationPerformanceAccess && (
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
            {journalistPerformanceAccess && (
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
            {languagePerformanceAccess && (
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
            {rankingKpiPeersPermission && (
              <Grid item xs={12} lg={6}>
                <RankingKpiPeersCharts
                  chartData={rankingKpiData}
                  loading={rankingKpiDataLoading}
                  error={rankingKpiDataError}
                  chartTitle={'Ranking KPI Peers'}
                  chartId='ranking-kpi-peers'
                  reportId='rankingKPIPeers'
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
            {rankingKpiPeersWithVisibilityPeersPermission && (
              <Grid item xs={12} lg={6}>
                <RankingKpiPeersCharts
                  chartData={rankingKpiVisibilityData}
                  loading={rankingKpiVisibilityDataLoading}
                  error={rankingKpiVisibilityDataError}
                  chartTitle={'KPI Peers Visibility'}
                  chartId='ranking-kpi-peers-visibility'
                  reportId='rankingKPIPeersWithVisibility'
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
            {publicationNDAccess && (
              <Grid item xs={12} lg={6}>
                <PublicationPerformance
                  chartData={publicationPerformanceNDData}
                  loading={publicationPerformanceNDDataLoading}
                  error={publicationPerformanceNDDataError}
                  cardTitle='publicationND'
                  chartId='publication-nd'
                  reportId='publicationPerformanceND'
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
            {publicationBDAccess && (
              <Grid item xs={12} lg={6}>
                <PublicationPerformance
                  chartData={publicationPerformanceBDData}
                  loading={publicationPerformanceBDDataLoading}
                  error={publicationPerformanceBDDataError}
                  cardTitle='publicationBD'
                  chartId='publication-bd'
                  reportId='publicationPerformanceBD'
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
            {publicationRDAccess && (
              <Grid item xs={12} lg={6}>
                <PublicationPerformance
                  chartData={publicationPerformanceRDData}
                  loading={publicationPerformanceRDDataLoading}
                  error={publicationPerformanceRDDataError}
                  cardTitle='publicationRD'
                  chartId='publication-rd'
                  reportId='publicationPerformanceRD'
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
            {publicationPerformanceMagazineAccess && (
              <Grid item xs={12} lg={6}>
                <PublicationPerformance
                  chartData={publicationPerformanceMagazineData}
                  loading={publicationPerformanceMagazineDataLoading}
                  error={publicationPerformanceMagazineDataError}
                  cardTitle='publicationMagazine'
                  chartId='publication-mg'
                  reportId='publicationPerformanceMagazine'
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
            {publicationPerformanceOnlineTop10Access && (
              <Grid item xs={12} lg={6}>
                <PublicationPerformance
                  chartData={publicationPerformanceOnlineTop10Data}
                  loading={publicationPerformanceOnlineTop10DataLoading}
                  error={publicationPerformanceOnlineTop10DataError}
                  cardTitle='publicationTop10'
                  chartId='publication-top-10'
                  reportId='publicationPerformanceOnlineTop10'
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
            {journalistPerformanceNDPermission && (
              <Grid item xs={12} lg={6}>
                <JournalistPerformance
                  chartData={journalistPerformanceNDData}
                  loading={journalistPerformanceNDDataLoading}
                  error={journalistPerformanceNDDataError}
                  cardTitle='JournalistND'
                  chartId='journalist-nd'
                  reportId='journalistPerformanceND'
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
            {journalistPerformanceBDPermission && (
              <Grid item xs={12} lg={6}>
                {' '}
                <JournalistPerformance
                  chartData={journalistPerformanceBDData}
                  loading={journalistPerformanceBDDataLoading}
                  error={journalistPerformanceBDDataError}
                  cardTitle='JournalistBD'
                  chartId='journalist-bd'
                  reportId='journalistPerformanceBD'
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
            {journalistPerformanceRDPermission && (
              <Grid item xs={12} lg={6}>
                {' '}
                <JournalistPerformance
                  chartData={journalistPerformanceRDData}
                  loading={journalistPerformanceRDDataLoading}
                  error={journalistPerformanceRDDataError}
                  cardTitle='JournalistRD'
                  chartId='journalist-rd'
                  reportId='journalistPerformanceRD'
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
            {companyTonalityPermission && (
              <Grid item xs={12} lg={6}>
                <CompanyTonality
                  chartData={companyTonalityData}
                  loading={companyTonalityLoading}
                  error={companyTonalityError}
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
            {tonalityVscorePermission && (
              <Grid item xs={12} lg={6}>
                <TonalityVScore
                  chartData={tonalityVScoreData}
                  loading={tonalityVScoreLoading}
                  error={tonalityVScoreError}
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
            {clientTonalityPermission && (
              <Grid item xs={12} lg={6}>
                <ClientTonality
                  chartData={clientTonality}
                  loading={clientTonalityLoading}
                  error={clientTonalityError}
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
            {positiveTonalityPermission && (
              <Grid item xs={12} lg={6}>
                <PositiveTonality
                  chartData={positiveTonality}
                  loading={positiveTonalityLoading}
                  error={positiveTonalityError}
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
            {negativeTonalityPermission && (
              <Grid item xs={12} lg={6}>
                <NegativeTonality
                  chartData={negativeTonality}
                  loading={negativeTonalityLoading}
                  error={negativeTonalityError}
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
          </Fragment>
        )}
      </Grid>
    </ApexChartWrapper>
  )
}

export default CustomDashboard
