// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import MultipleCharts from 'src/views/dashboards/visibilityImageQe/AnalyticsMultipleCharts'
import VisibilityRanking from 'src/views/dashboards/visibilityImageQe/AnalyticsVisibilityRanking'

// ** redux import
import { useSelector } from 'react-redux'
import { selectUserData, selectSelectedMedia } from 'src/store/apps/user/userSlice'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

// ** hooks
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import useChartPermission from 'src/hooks/useChartPermission'
import useFetchReports from 'src/api/dashboard/useFetchReports'
import { useRouter } from 'next/router'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const VisibilityChartJS = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

  // ** chart permissions
  const companyVisibilityPermission = useChartPermission('companyVisibility')
  const visibilityRankingPermission = useChartPermission('visibilityRanking')
  const publicationsVisibilityPermission = useChartPermission('publicationsVisibility')
  const publicationsClientVisibilityPermission = useChartPermission('publicationsClientVisibility')
  const journalistVisibilityPermission = useChartPermission('journalistVisibility')
  const journalistClientVisibilityPermission = useChartPermission('journalistClientVisibility')
  const reportingSubjectVisibilityPermission = useChartPermission('reportingSubjectVisibility')
  const reportingSubjectClientVisibilityPermission = useChartPermission('reportingSubjectClientVisibility')

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
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

  // * data hooks
  const {
    chartData: companyVisibility,
    loading: companyLoading,
    error: companyError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/companyVisibility/',
    idType: 'clientIds',
    isMedia: true,
    dataKey: 'companyVisibility'
  })

  const {
    chartData: visibilityRanking,
    loading: rankingLoading,
    error: rankingError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/visibilityRanking/',
    idType: 'clientIds',
    isMedia: true,
    dataKey: 'visibilityRanking'
  })

  const {
    chartData: publicationVisibility,
    loading: visibilityLoading,
    error: visibilityError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/publicationsVisibility/',
    idType: 'clientIds',
    isMedia: true,
    dataKey: 'publicationsVisibility'
  })

  const {
    chartData: publicationClientVisibility,
    loading: publicationClientLoading,
    error: publicationClientError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/publicationsClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    dataKey: 'publicationsClientVisibility'
  })

  const {
    chartData: subjectVisibility,
    loading: subjectLoading,
    error: subjectError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/reportingSubjectVisibility/',
    idType: 'clientIds',
    isMedia: true,
    dataKey: 'reportingSubjectVisibility'
  })

  const {
    chartData: subjectClientVisibility,
    loading: subjectClientLoading,
    error: subjectClientError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/reportingSubjectClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    dataKey: 'reportingSubjectClientVisibility'
  })

  const {
    chartData: journalistVisibility,
    loading: journalistLoading,
    error: journalistError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/journalistVisibility/',
    idType: 'clientIds',
    isMedia: true,
    dataKey: 'journalistVisibility'
  })

  const {
    chartData: journalistClientVisibility,
    loading: journalistClientLoading,
    error: journalistClientError
  } = useFetchReports({
    media: selectedMedia,
    endpoint: '/journalistClientVisibility/',
    idType: 'clientId',
    isMedia: true,
    dataKey: 'journalistClientVisibility'
  })

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['visibilityImageQE']

  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          {!!companyVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!visibilityRankingPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!publicationsVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!publicationsClientVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!reportingSubjectVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!reportingSubjectClientVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!journalistVisibilityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!journalistClientVisibilityPermission && (
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
          )}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default VisibilityChartJS
