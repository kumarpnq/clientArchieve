// DataGrid.js
import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import PageHeader from 'src/@core/components/page-header'
import ArticleSelection from 'src/views/table/online-headlines/ArticleSelection'
import CardSelection from 'src/views/table/online-headlines/CardSelection'
import useScreenPermissions from 'src/hooks/useScreenPermissions'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { useSelector } from 'react-redux'

const DataGrid = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const screenPermissions = useScreenPermissions()
  const hasAccess = screenPermissions['onlineHeadlines']
  const clientName = selectedClient ? selectedClient.clientName : ''

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
                Online News
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
