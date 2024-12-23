import React from 'react'
import { GridOverlay, DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import styled from '@emotion/styled'
import Typography from '@mui/material/Typography'

const StyledDataGrid = styled(MuiDataGrid)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,

  // padding: '8px 10px',
  borderRadius: '12px',
  borderColor: 'transparent',
  '.MuiDataGrid-withBorderColor': {
    border: 'none'
  },
  '.MuiDataGrid-cell:is(:focus, :focus-within)': {
    outline: 'none'
  },
  '.MuiDataGrid-row': {
    borderBottom: '1px solid rgb(224 224 224)',
    fontWeight: 600,
    color: theme.palette.text.secondary
  },

  '.MuiDataGrid-iconButtonContainer': {
    visibility: 'visible'
  },
  '.MuiDataGrid-sortIcon': {
    opacity: '0.7 !important'
  },

  // '.MuiButtonBase-root.MuiIconButton-root': {
  //   color: 'red'
  // },
  '& .MuiDataGrid-main .MuiDataGrid-columnHeaders': {
    // backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    minHeight: 40,
    maxHeight: 40,
    '.MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      color: theme.palette.text.secondary,
      fontSize: '14px',
      textTransform: 'capitalize'
    },
    '& .MuiDataGrid-columnHeader:is(:focus, :focus-within)': {
      outline: 'none'
    }
  }
}))

const DataGrid = props => {
  const { slots, ...rest } = props

  return (
    <StyledDataGrid
      disableColumnFilter
      disableColumnSelector
      disableRowSelectionOnClick
      disableColumnMenu
      hideFooter
      slots={{
        ...slots,
        noRowsOverlay: () => (
          <GridOverlay>
            <Typography variant='h4' color='text.secondary' textAlign='center' sx={{ wordSpacing: '2px' }}>
              No data available
            </Typography>
          </GridOverlay>
        )
      }}
      {...rest}
    />
  )
}

export default DataGrid
