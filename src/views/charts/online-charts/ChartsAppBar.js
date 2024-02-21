import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import DateRangeIcon from '@mui/icons-material/DateRange'

const ChartsAppBar = ({ handleDateRangeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = range => {
    handleDateRangeChange(range)
    handleMenuClose()
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit' component='div' sx={{ flexGrow: 1 }}>
          Charts
        </Typography>
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          aria-label='select date range'
          aria-controls='date-range-menu'
          aria-haspopup='true'
          onClick={handleMenuOpen}
        >
          <DateRangeIcon />
        </IconButton>
        <Menu id='date-range-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuItemClick('today')}>Today</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('last_week')}>Last Week</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('last_month')}>Last Month</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('last_three_months')}>Last 3 Months</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default ChartsAppBar
