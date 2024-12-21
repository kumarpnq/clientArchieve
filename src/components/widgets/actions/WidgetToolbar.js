import { Button, Grid, Stack } from '@mui/material'
import { GridToolbarColumnsButton, GridToolbarDensitySelector } from '@mui/x-data-grid'
import React, { Fragment, useEffect, useMemo } from 'react'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import LaunchIcon from '@mui/icons-material/Launch'
import CloseIcon from '@mui/icons-material/Close'
import ExportDataGrid from 'src/components/datagrid/export'

const icons = {
  charts: <EqualizerIcon />,
  table: <GridViewOutlinedIcon />
}

function WidgetToolbar(props) {
  const { apiActions, value, toggle, render, actions, openModal, closeModal, modalState } = props

  const index = useMemo(() => render.indexOf(value), [render, value])

  useEffect(() => {
    // Handle browser back button
    const handlePopState = event => {
      if (modalState) {
        // Prevent default behavior
        event.preventDefault()
        closeModal()

        // Push the current state back to prevent URL change
        window.history.pushState(null, '', window.location.pathname)

        return false
      }
    }

    // Add state to history when modal opens
    if (modalState) {
      window.history.pushState(null, '', window.location.pathname)
    }

    // Listen for popstate event
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [modalState, closeModal])

  return (
    <Fragment>
      <Grid
        container
        className='cancelSelection'
        mb={3}
        rowSpacing={2}
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
          <Stack direction='row' gap={2} alignItems='center'>
            {actions ? (
              actions
            ) : (
              <Fragment>
                <ExportDataGrid />
                <GridToolbarColumnsButton size='small' />
                <GridToolbarDensitySelector size='small' />
              </Fragment>
            )}
            {render.length > 1 ? (
              <Button
                startIcon={icons[index === render.length - 1 ? render[0] : render[index + 1]]}
                size='small'
                onClick={toggle}
              >
                {index === render.length - 1 ? render[0] : render[index + 1]}
              </Button>
            ) : null}
            <Button
              size='small'
              onClick={modalState ? closeModal : openModal}
              startIcon={modalState ? <CloseIcon fontSize='small' /> : <LaunchIcon fontSize='small' />}
            >
              {modalState ? 'Close' : 'Open'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default WidgetToolbar
