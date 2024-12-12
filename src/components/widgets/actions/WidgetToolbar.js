import { Button, Grid, Menu, MenuItem, Stack } from '@mui/material'
import { GridToolbarColumnsButton, GridToolbarDensitySelector } from '@mui/x-data-grid'
import React, { Fragment } from 'react'
import useMenu from 'src/hooks/useMenu'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import EqualizerIcon from '@mui/icons-material/Equalizer'

const icons = {
  charts: <EqualizerIcon />,
  table: <GridViewOutlinedIcon />
}

function WidgetToolbar(props) {
  const { charts, apiActions, value, toggle, actions } = props

  return (
    <Fragment>
      <Grid
        container
        className='cancelSelection'
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
        <Grid item xs>
          {apiActions}
        </Grid>
        <Grid item>
          <Stack direction='row' gap={1} alignItems='flex-start'>
            {actions ? (
              actions
            ) : (
              <Fragment>
                <GridToolbarColumnsButton size='small' />
                <GridToolbarDensitySelector size='small' />
              </Fragment>
            )}
            {charts ? (
              <Button startIcon={icons[value === 'charts' ? 'table' : 'charts']} size='small' onClick={toggle}>
                {value === 'charts' ? 'Table' : 'Charts'}
              </Button>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default WidgetToolbar
