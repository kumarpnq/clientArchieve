// Pagination.js

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const Pagination = ({
  paginationModel,
  currentPage,
  recordsPerPage,
  handleLeftPagination,
  handleRightPagination,
  handleRecordsPerPageChange
}) => {
  return (
    <Box display='flex' justifyContent='flex-end' alignItems='center' p={2}>
      {/* Empty box to push content to the right side */}
      <Typography variant='body2' sx={{ marginLeft: 7 }}>
        Total Records: {paginationModel.totalRecords}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant='body2' sx={{ marginRight: 2 }}>
        Records per Page:
      </Typography>
      <Select value={recordsPerPage} onChange={handleRecordsPerPageChange}>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        {/* Add more options as needed */}
      </Select>
      <Button startIcon={<NavigateBeforeIcon />} onClick={handleLeftPagination} disabled={currentPage === 1}>
        Previous Page
      </Button>
      <Button
        endIcon={<NavigateNextIcon />}
        onClick={handleRightPagination}
        disabled={currentPage === Math.ceil(paginationModel.totalRecords / paginationModel.pageSize)}
      >
        Next Page
      </Button>
    </Box>
  )
}

export default Pagination
