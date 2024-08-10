import React from 'react'
import { Grid } from '@mui/material'

import ContentCard from './components/ContentCard'

const DataCard = () => {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5].map(i => (
        <Grid item xs={12} key={i}>
          <ContentCard />
        </Grid>
      ))}
    </Grid>
  )
}

export default DataCard
