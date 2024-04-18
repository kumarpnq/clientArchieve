// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import AnalyticsWordCloud from 'src/views/dashboards/analytics/AnalyticsWordCloud'

// ** redux import
import { useSelector } from 'react-redux'
import { selectUserData, selectSelectedMedia } from 'src/store/apps/user/userSlice'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import useChartsData from 'src/api/dashboard-analytics/useChartsData'

// ** hooks
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import MultipleCharts from 'src/views/dashboards/analytics/AnalyticsMultipleCharts'
import VisibilityRanking from 'src/views/dashboards/analytics/AnalyticsVisibilityRanking'
import useVisibilityRanking from 'src/api/dashboard-analytics/useVisibilityRanking'
import PublicationVisibility from 'src/views/dashboards/analytics/AnalyticsPublicationVisibility'
import usePublicationVisibility from 'src/api/dashboard-analytics/usePublicationVisibility'
import useSubjectVisibility from 'src/api/dashboard-analytics/useSubjectVisibility'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const AnalyticsDashboard = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

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
  const wordCloudPermission = userDetails?.clientArchiveRoles?.find(i => i.name === 'wordCloud')?.permission

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['analytics']

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
    chartData: subjectVisibility,
    loading: subjectLoading,
    error: subjectError
  } = useSubjectVisibility({ media: selectedMedia, endpoint: '/reportingSubjectClientVisibility/' })
  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {wordCloudPermission && (
            <>
              {' '}
              <Grid item xs={12} md={6}>
                <AnalyticsWordCloud />
              </Grid>
              <Grid item xs={12} md={6}>
                <AnalyticsWordCloud />
              </Grid>
            </>
          )}
          <Grid item xs={12} lg={6}>
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
            <AnalyticsWebsiteAnalyticsSlider
              legendColor={legendColor}
              primary={primaryColor}
              yellow={yellowColor}
              warning={lineChartWarning}
              info={polarChartInfo}
              grey={polarChartGrey}
              green={polarChartGreen}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnalyticsOrderVisits />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsEarningReports />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSalesByCountries />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTotalEarning />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsMonthlyCampaignState />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSourceVisits />
          </Grid>
          <Grid item xs={12} lg={8}>
            <AnalyticsProject />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
