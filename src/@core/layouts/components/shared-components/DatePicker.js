import { Fragment, useState } from 'react'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { IconButton, Popover, Stack, Box, Button } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ClearIcon from '@mui/icons-material/Clear'

import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStartDate, selectSelectedEndDate, setSelectedDateRange } from 'src/store/apps/user/userSlice'

const DateBar = () => {
  const dispatch = useDispatch()
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDateChange = (startDate, endDate) => {
    dispatch(setSelectedDateRange({ startDate, endDate }))
  }

  return (
    <Fragment>
      <IconButton onClick={handleIconClick} color='inherit' aria-haspopup='true'>
        <DateRangeIcon fontSize='1.625rem' />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        sx={{ mt: 4.25, minWidth: 200 }}
      >
        <Stack spacing={2} p={2} sx={{ minWidth: '200px', minHeight: '200px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display='flex' alignItems='center'>
              <DatePicker
                label='Start Date'
                value={selectedStartDate}
                onChange={date => handleDateChange(date, selectedEndDate)}
              />
              {selectedStartDate && (
                <IconButton onClick={() => handleDateChange(null, selectedEndDate)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
            <Box display='flex' alignItems='center'>
              <DatePicker
                label='End Date'
                value={selectedEndDate}
                onChange={date => handleDateChange(selectedStartDate, date)}
              />
              {selectedEndDate && (
                <IconButton onClick={() => handleDateChange(selectedStartDate, null)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </LocalizationProvider>
          <Button
            onClick={() => {
              handleDateChange(null, null)
            }}
          >
            Clear
          </Button>
        </Stack>
      </Popover>
    </Fragment>
  )
}

export default DateBar
