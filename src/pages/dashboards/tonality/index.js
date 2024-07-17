'use client'
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
import useTonality from 'src/api/dashboard-tonality/useCompanyTonality'

// * components import
import CompanyTonality from 'src/views/dashboards/tonality/CompanyTonality'
import TonalityVScore from 'src/views/dashboards/tonality/TonalityVScore'
import ClientTonality from 'src/views/dashboards/tonality/ClientTonality'
import PositiveTonality from 'src/views/dashboards/tonality/PositiveTonality'
import NegativeTonality from 'src/views/dashboards/tonality/NegativeTonality'
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import useChartPermission from 'src/hooks/useChartPermission'
import { useRouter } from 'next/router'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const TonalityCharts = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

  // ** chart permissions
  const companyTonalityPermission = useChartPermission('companyTonality')
  const tonalityVScorePermission = useChartPermission('tonalityVscore')
  const clientTonalityPermission = useChartPermission('clientTonality')
  const positiveTonalityPermission = useChartPermission('positiveTonality')
  const negativeTonalityPermission = useChartPermission('negativeTonality')

  // * data hooks
  const {
    chartData: companyTonalityData,
    loading: companyTonalityLoading,
    error: companyTonalityError
  } = useTonality({ media: selectedMedia, endpoint: '/companyTonality/', idType: 'clientIds', isCompanyIds: true })

  const {
    chartData: tonalityVScoreData,
    loading: tonalityVScoreLoading,
    error: tonalityVScoreError
  } = useTonality({ media: selectedMedia, endpoint: '/tonalityVscore/', idType: 'clientIds', isCompanyIds: false })

  const {
    chartData: clientTonality,
    loading: clientTonalityLoading,
    error: clientTonalityError
  } = useTonality({ media: selectedMedia, endpoint: '/clientTonality/', idType: 'clientId', isCompanyIds: false })

  const {
    chartData: positiveTonality,
    loading: positiveTonalityLoading,
    error: positiveTonalityError
  } = useTonality({ media: selectedMedia, endpoint: '/positiveTonality/', idType: 'clientIds', isCompanyIds: false })

  const {
    chartData: negativeTonality,
    loading: negativeTonalityLoading,
    error: negativeTonalityError
  } = useTonality({ media: selectedMedia, endpoint: '/negativeTonality/', idType: 'clientIds', isCompanyIds: false })

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

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['tonality']

  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          {!!companyTonalityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!tonalityVScorePermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!clientTonalityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!positiveTonalityPermission && (
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
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!negativeTonalityPermission && (
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
          )}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default TonalityCharts
