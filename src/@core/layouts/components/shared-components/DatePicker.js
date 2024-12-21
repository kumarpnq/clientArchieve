import { Fragment, useMemo, useState } from 'react'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { IconButton, Popover, Stack, Box, Button, Typography } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import ClearIcon from '@mui/icons-material/Clear'

import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStartDate, selectSelectedEndDate, setSelectedDateRange } from 'src/store/apps/user/userSlice'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Online } from 'src/constants/filters'

const DateBar = () => {
  const router = useRouter()
  const currentRoute = router.pathname
  const { media, mediaType } = useSelector(state => state.filter)

  const isShowDateTime = useMemo(
    () =>
      mediaType === Online ||
      media === 'online' ||
      currentRoute === '/media' ||
      currentRoute === '/headlines/online' ||
      currentRoute === '/headlines/print-online',
    [media, currentRoute, mediaType]
  )

  const dispatch = useDispatch()
  const selectedStartDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const dateFormat = isShowDateTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'
  const formattedStartDate = selectedStartDate ? dayjs(selectedStartDate).format(dateFormat) : null
  const formattedEndDate = selectedEndDate ? dayjs(selectedEndDate).format(dateFormat) : null

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

  const DateRangeComponent = () => {
    return (
      <Typography
        component={'span'}
        fontSize={'0.8em'}
        sx={{ color: 'primary.main', letterSpacing: '1px' }}
      >{`${formattedStartDate} - ${formattedEndDate}`}</Typography>
    )
  }

  return (
    <Fragment>
      <DateRangeComponent />
      <IconButton onClick={handleIconClick} color='primary' aria-haspopup='true'>
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
          {isShowDateTime ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display='flex' alignItems='center'>
                <DateTimePicker
                  label='Start Date'
                  value={selectedStartDate}
                  onChange={date => handleDateChange(date, selectedEndDate)}
                  ampm={false}
                  format='DD/MM/YYYY HH:mm:ss'
                />
                {selectedStartDate && (
                  <IconButton onClick={() => handleDateChange(null, selectedEndDate)}>
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
              <Box display='flex' alignItems='center'>
                <DateTimePicker
                  label='End Date'
                  value={selectedEndDate}
                  onChange={date => handleDateChange(selectedStartDate, date)}
                  ampm={false}
                  format='DD/MM/YYYY HH:mm:ss'
                />
                {selectedEndDate && (
                  <IconButton onClick={() => handleDateChange(selectedStartDate, null)}>
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            </LocalizationProvider>
          ) : (
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
          )}

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
