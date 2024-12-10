import { Box, Grid, Stack } from '@mui/material'
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import React from 'react'
import Searchbox from '../Searchbox'

function Toolbar() {
  return (
    <Grid container mb={4}>
      <Grid item xs></Grid>
      <Grid item>
        <Stack
          direction='row'
          gap={1}
          sx={{
            bgcolor: 'customColors.tableHeaderBg',
            padding: '3px !important',
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
            borderRadius: '8px',
            '& .MuiButtonBase-root.MuiButton-root, .MuiButtonBase-root.MuiButton-root:hover': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: '8px',
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;',
              px: 8,

              '& .MuiButton-startIcon>*:nth-of-type(1)': {
                fontSize: 16
              }
            }
          }}
        >
          <Searchbox />
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Toolbar
