// ** MUI Import
import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** redux import
import { useSelector } from 'react-redux'
import { selectUserData, selectSelectedMedia } from 'src/store/apps/user/userSlice'

// ** Custom Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import VolumeRanking from 'src/views/dashboards/visibility&Count/VolumeRanking'
import SubjectVscore from 'src/views/dashboards/visibility&Count/SubjectVscore'
import JournalistVscore from 'src/views/dashboards/visibility&Count/JournalistVscore'

// ** custom hooks import
import useVisibilityCount from 'src/api/dashboard-visibilityCount/useVisibilityCount'
import useJournalistVscore from 'src/api/dashboard-visibilityCount/useJournalistVscore'
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import useChartPermission from 'src/hooks/useChartPermission'
import { useRouter } from 'next/router'

const CountCharts = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

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

  // ** chart permissions
  const volumeRankingPermission = useChartPermission('volumeRanking')
  const reportingSubjectVScorePermission = useChartPermission('reportingSubjectVscore')
  const journalistVScorePermission = useChartPermission('journalistVscore')

  // * data hooks
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

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['visibilityAndCount']

  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          {!!volumeRankingPermission && (
            <VolumeRanking
              chartData={volumeRankingData}
              loading={volumeRankingLoading}
              error={volumeRankingError}
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
          {!!journalistVScorePermission && (
            <JournalistVscore
              JournalistVScoreData={journalistVscoreData}
              loading={journalistVscoreLoading}
              error={journalistVscoreError}
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
          {!!reportingSubjectVScorePermission && (
            <SubjectVscore
              JournalistVScoreData={subjectVscoreData}
              loading={subjectVscoreLoading}
              error={subjectVscoreError}
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

export default CountCharts
