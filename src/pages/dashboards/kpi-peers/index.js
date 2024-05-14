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
import useKpiChartsData from 'src/api/dashboard-kpicharts/useFetchKpiChartsData'

// ** hooks
// import useScreenPermissions from 'src/hooks/useScreenPermissions'

// * components import

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const KPIPeersCharts = () => {
  const userDetails = useSelector(selectUserData)
  const selectedMedia = useSelector(selectSelectedMedia)

  // * data hooks
  const {
    chartData: rankingKpiData,
    loading: rankingKpiDataLoading,
    error: rankingKpiDataError
  } = useKpiChartsData({
    endpoint: '/rankingKpiPeers/'
  })

  const {
    chartData: rankingKpiVisibilityData,
    loading: rankingKpiVisibilityDataLoading,
    error: rankingKpiVisibilityDataError
  } = useKpiChartsData({
    endpoint: '/rankingKpiPeersWithVisibility/'
  })
  console.log(rankingKpiData)

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
          test
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default KPIPeersCharts
