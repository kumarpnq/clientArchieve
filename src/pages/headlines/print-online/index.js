// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import ArticleSelection from 'src/views/table/print-online-headlines/ArticleSelection'
import CardSelection from 'src/views/table/print-online-headlines/CardSelection'

// ** Redux
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import useScreenPermissions from 'src/hooks/useScreenPermissions'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const DataGrid = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientName = selectedClient ? selectedClient.clientName : ''

  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['bothHeadlines']

  if (!hasAccess) {
    return <div>You don't have access to this page.</div>
  }

  return (
    <Grid container spacing={2}>
      <PageHeader
        title={
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography variant='h5' sx={{ color: 'primary.main' }}>
                Print & Online News
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='subtitle1' sx={{ color: 'primary.main' }}>
                {clientName}
              </Typography>
            </Grid>
          </Grid>
        }
      />
      <Grid item xs={12}>
        <ArticleSelection />
      </Grid>

      <Grid item xs={12}>
        <CardSelection />
      </Grid>
    </Grid>
  )
}

export default DataGrid
