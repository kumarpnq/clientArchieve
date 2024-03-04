// src/@core/layouts/components/shared-components/DaysJumper.js
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedDateRange } from 'src/store/apps/user/userSlice'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SvgIcon from '@mui/material/SvgIcon'
import dayjs from 'dayjs'

// D Icon
const DIcon = props => (
  <SvgIcon {...props}>
    <text x='50%' y='60%' fontSize='22px' textAnchor='middle' alignmentBaseline='middle'>
      D
    </text>
  </SvgIcon>
)

const DaysJumper = ({ settings }) => {
  const { direction } = settings
  const dispatch = useDispatch()
  const [selectedDayFilter, setSelectedDayFilter] = useState('1D')
  const [anchorEl, setAnchorEl] = useState(null)

  const calculateDate = days => dayjs().subtract(days, 'day')

  const handleFilter = (days, label) => {
    const start = calculateDate(days)
    dispatch(setSelectedDateRange({ startDate: start, endDate: start }))
    setSelectedDayFilter(label)
    setAnchorEl(null)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = days => {
    const startDate = calculateDate(days)
    dispatch(setSelectedDateRange({ startDate, endDate: dayjs() }))
    setSelectedDayFilter(`${days}D`)
    handleCloseMenu()
  }

  useEffect(() => {
    handleFilter(1, '1D') // Default filter
  }, [])

  return (
    <>
      <IconButton onClick={handleOpenMenu} color='inherit'>
        <DIcon fontSize='1.625rem' />
      </IconButton>

      <Menu
        id='time-filter-menu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ mt: 4.25, minWidth: 200 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem onClick={() => handleFilterChange(1)} selected={selectedDayFilter === '1D'}>
          1D
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange(7)} selected={selectedDayFilter === '7D'}>
          7D
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange(30)} selected={selectedDayFilter === '30D'}>
          30D
        </MenuItem>
      </Menu>
    </>
  )
}

export default DaysJumper
