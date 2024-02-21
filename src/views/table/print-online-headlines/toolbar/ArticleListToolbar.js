import React, { useEffect, useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import ImageIcon from '@mui/icons-material/Image'
import DownloadIcon from '@mui/icons-material/Download'
import RssFeedIcon from '@mui/icons-material/RssFeed'
import DateRangeIcon from '@mui/icons-material/DateRange'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ClearIcon from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import useMediaQuery from '@mui/material/useMediaQuery'
import dayjs from 'dayjs'

// 1D Icon
const OneDIcon = props => (
  <SvgIcon {...props}>
    <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
      1D
    </text>
  </SvgIcon>
)

// 7D Icon
const SevenDIcon = props => (
  <SvgIcon {...props}>
    <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
      7D
    </text>
  </SvgIcon>
)

// 1M Icon
const OneMIcon = props => (
  <SvgIcon {...props}>
    <text x='50%' y='50%' fontSize='14px' text-anchor='middle' alignment-baseline='middle'>
      1M
    </text>
  </SvgIcon>
)

const ArticleListToolbar = ({
  setSearchQuery,
  isSearchBarVisible,
  toggleSearchBarVisibility,
  handleDelete,
  handleEmail,
  handleImage,
  handleDownload,
  handleRssFeed,
  openFilterPopover,
  filterPopoverAnchor,
  closeFilterPopover,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  primaryColor
}) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const [selectedFilter, setSelectedFilter] = useState('1D')

  // Helper function to calculate date by subtracting days from the current date
  const calculateDate = days => dayjs().subtract(days, 'day')

  // Function to handle 1D filter
  const handleFilter1D = () => {
    const startDate = calculateDate(1)
    setSelectedStartDate(startDate)
    setSelectedEndDate(startDate)
    setSelectedFilter('1D')
  }

  // Function to handle 7D filter
  const handleFilter7D = () => {
    const startDate = calculateDate(7)
    setSelectedStartDate(startDate)
    setSelectedEndDate(dayjs()) // Set end date to today
    setSelectedFilter('7D')
  }

  // Function to handle 1M filter
  const handleFilter1M = () => {
    const startDate = calculateDate(30)
    setSelectedStartDate(startDate)
    setSelectedEndDate(dayjs()) // Set end date to today
    setSelectedFilter('1M')
  }

  // useEffect to set default date for 1D filter and highlight the icon when component mounts
  useEffect(() => {
    handleFilter1D()
  }, []) // Empty dependency array to run the effect only once

  return (
    <Toolbar
      sx={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {!isMobile && (
        <Typography variant='h6' sx={{ flex: '1' }}>
          Feed List
        </Typography>
      )}
      {isSearchBarVisible && (
        <TextField
          label='Search Articles'
          variant='outlined'
          size='small'
          onChange={e => setSearchQuery(e.target.value)}
        />
      )}
      <Button onClick={toggleSearchBarVisibility} sx={{ color: primaryColor, mr: 0 }}>
        <SearchIcon />
      </Button>
      <Button onClick={handleDelete} sx={{ color: primaryColor, mr: 0 }}>
        <DeleteIcon />
      </Button>
      <Button onClick={handleEmail} sx={{ color: primaryColor, mr: 0 }}>
        <EmailIcon />
      </Button>
      <Button onClick={handleImage} sx={{ color: primaryColor, mr: 0 }}>
        <ImageIcon />
      </Button>
      <Button onClick={handleDownload} sx={{ color: primaryColor, mr: 0 }}>
        <DownloadIcon />
      </Button>
      <Button onClick={handleRssFeed} sx={{ color: primaryColor, mr: 0 }}>
        <RssFeedIcon />
      </Button>
      <Button onClick={openFilterPopover} sx={{ color: primaryColor, mr: 0 }}>
        <DateRangeIcon />
      </Button>
      <Button
        onClick={handleFilter1D}
        sx={{ color: primaryColor, mr: 0 }}
        variant={selectedFilter === '1D' ? 'contained' : 'text'}
      >
        <OneDIcon />
      </Button>
      <Button
        onClick={handleFilter7D}
        sx={{ color: primaryColor, mr: 0 }}
        variant={selectedFilter === '7D' ? 'contained' : 'text'}
      >
        <SevenDIcon />
      </Button>
      <Button
        onClick={handleFilter1M}
        sx={{ color: primaryColor, mr: 0 }}
        variant={selectedFilter === '1M' ? 'contained' : 'text'}
      >
        <OneMIcon />
      </Button>
      <Popover
        open={Boolean(filterPopoverAnchor)}
        anchorEl={filterPopoverAnchor}
        onClose={closeFilterPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Stack spacing={2} p={2} sx={{ minWidth: '200px', minHeight: '200px' }}>
          <Typography variant='subtitle2'>Filter by Date Range</Typography>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display='flex' alignItems='center'>
              <DatePicker label='Start Date' value={selectedStartDate} onChange={date => setSelectedStartDate(date)} />
              {selectedStartDate && (
                <IconButton onClick={() => setSelectedStartDate(null)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
            <Box display='flex' alignItems='center'>
              <DatePicker label='End Date' value={selectedEndDate} onChange={date => setSelectedEndDate(date)} />
              {selectedEndDate && (
                <IconButton onClick={() => setSelectedEndDate(null)}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>
          </LocalizationProvider>
          <Button
            onClick={() => {
              setSelectedStartDate(null)
              setSelectedEndDate(null)
            }}
          >
            Clear
          </Button>
        </Stack>
      </Popover>
    </Toolbar>
  )
}

export default ArticleListToolbar
