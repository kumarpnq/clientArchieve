import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import RecordsPerPageSelector from './RecordsPerPageSelector'

const Pagination = ({
  paginationModel,
  currentPage,
  recordsPerPage,
  handleLeftPagination,
  handleRightPagination,
  handleRecordsPerPageUpdate
}) => {
  // Calculate the range of records currently displayed
  const startRecord = (currentPage - 1) * recordsPerPage + 1

  const endRecord =
    currentPage * recordsPerPage > paginationModel.totalRecords
      ? paginationModel.totalRecords
      : currentPage * recordsPerPage

  return (
    <Box
      display='flex'
      flexDirection={{ xs: 'column', md: 'row' }} // Adjust the layout based on screen size
      alignItems='center'
      p={2}
    >
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }} // Adjust the layout based on screen size
        alignItems='center'
        mb={{ xs: 2, md: 0 }} // Add margin-bottom for small screens
      >
        {/* Empty box to push content to the right side */}
        {/* <Typography variant='body2' sx={{ marginLeft: { xs: 0, md: 7 } }}>
          Total Records:  {startRecord}-{endRecord} of {paginationModel.totalRecords}
        </Typography> */}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }} // Adjust the layout based on screen size
        alignItems='center'
        mb={{ xs: 2, md: 0 }} // Add margin-bottom for small screens
      >
        <RecordsPerPageSelector
          recordsPerPage={recordsPerPage}
          handleRecordsPerPageUpdate={handleRecordsPerPageUpdate}
        />
      </Box>
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }} // Adjust the layout based on screen size
        alignItems='center'
      >
        <Typography variant='body2' sx={{ marginLeft: { xs: 0, md: 7 } }}>
          {startRecord}-{endRecord} of {paginationModel.totalRecords}
        </Typography>
        <Button
          startIcon={<NavigateBeforeIcon />}
          onClick={handleLeftPagination}
          disabled={currentPage === 1}
          sx={{ marginRight: { xs: 0, md: 1 } }}
        />
        <Button
          endIcon={<NavigateNextIcon />}
          onClick={handleRightPagination}
          disabled={
            currentPage === Math.ceil(paginationModel.totalRecords / paginationModel.pageSize) ||
            endRecord === paginationModel.totalRecords
          }
        />
      </Box>
    </Box>
  )
}

export default Pagination
