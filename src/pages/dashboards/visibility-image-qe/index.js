// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsJournalist from 'src/views/dashboards/visibilityImageQe/AnalyticsJournalist'
import AnalyticsJournalistClient from 'src/views/dashboards/visibilityImageQe/AnalyticsJournalistClient'
import MultipleCharts from 'src/views/dashboards/visibilityImageQe/AnalyticsMultipleCharts'
import AnalyticsPublicationClient from 'src/views/dashboards/visibilityImageQe/AnalyticsPublicationClient'
import PublicationVisibility from 'src/views/dashboards/visibilityImageQe/AnalyticsPublicationVisibility'
import AnalyticsSubject from 'src/views/dashboards/visibilityImageQe/AnalyticsSubject'
import AnalyticsSubjectClient from 'src/views/dashboards/visibilityImageQe/AnalyticsSubjectClient'
import VisibilityRanking from 'src/views/dashboards/visibilityImageQe/AnalyticsVisibilityRanking'

// ** custom hooks import
import useChartsData from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useChartsData'
import useJournalistClientVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useJournalistClientVisibility'
import useJournalistVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useJournalistVisibility'
import usePublicationClientVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/usePublicationClientVisibility'
import usePublicationVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/usePublicationVisibility'
import useReportingSubjectVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useSubjectClientVisiblity'
import useSubjectVisibility from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useSubjectVisibility'
import useVisibilityRanking from 'src/api/dashboard-visibilityImageQe/dashboard-analytics/useVisibilityRanking'

// ** redux import
import { useSelector } from 'react-redux'
import { selectUserData, selectSelectedMedia } from 'src/store/apps/user/userSlice'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const VisibilityChartJS = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

  const companyVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'companyVisibility'
  )?.permission

  const visibilityRankingPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'visibilityRanking'
  )?.permission

  const publicationsVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'publicationsVisibility'
  )?.permission

  const publicationsClientVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'publicationsClientVisibility'
  )?.permission

  const journalistVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'journalistVisibility'
  )?.permission

  const journalistClientVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'journalistClientVisibility'
  )?.permission

  const reportingSubjectVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'reportingSubjectVisibility'
  )?.permission

  const reportingSubjectClientVisibilityPermission = userDetails?.clientArchiveRoles?.find(
    i => i.name === 'reportingSubjectClientVisibility'
  )?.permission

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

  // * data hooks
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

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          {!!companyVisibilityPermission && (
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
          )}
        </Grid>
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
      </Grid>
    </ApexChartWrapper>
  )
}

export default VisibilityChartJS
