import React from 'react'
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import styled from '@emotion/styled'

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
  return <StyledDataGrid {...props} />
}

export default DataGrid
