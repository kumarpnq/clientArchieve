import { Grid, Stack } from '@mui/material'
import { GridToolbarColumnsButton, GridToolbarDensitySelector } from '@mui/x-data-grid'
import React from 'react'

function Toolbar() {
  return (
    <Grid
      container
      mb={3}
      sx={{
        '& .MuiButtonBase-root.MuiButton-root, .MuiButtonBase-root.MuiButton-root:hover': {
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;',
          px: 4,

          '& .MuiButton-startIcon>*:nth-of-type(1)': {
            fontSize: 16
          }
        }
      }}
    >
      <Grid item xs></Grid>
      <Grid item>
        <Stack direction='row' gap={1} alignItems='flex-start'>
          <GridToolbarColumnsButton size='small' />
          {/* <GridToolbarFilterButton size='small' /> */}
          <GridToolbarDensitySelector size='small' />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Toolbar
