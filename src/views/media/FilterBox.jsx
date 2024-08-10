import React, { useState } from 'react'
import { Box, IconButton, Menu, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const FilterBox = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [sortOption, setSortOption] = useState('')
  const [viewOption, setViewOption] = useState('')

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSortChange = event => {
    setSortOption(event.target.value)
  }

  const handleViewChange = event => {
    setViewOption(event.target.value)
  }

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <IconifyIcon icon='oui:filter' />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <FormControl fullWidth>
            <InputLabel id='sort-by' sx={{ mt: -2 }}>
              Sort By
            </InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              variant='outlined'
              label={'Sort By'}
              labelId='sort-by'
              size='small'
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='likes'>Likes</MenuItem>
              <MenuItem value='followers'>Followers</MenuItem>
              <MenuItem value='views'>Views</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem>
          <FormControl fullWidth>
            <InputLabel id='view-by' sx={{ mt: -2 }}>
              View By
            </InputLabel>
            <Select value={viewOption} onChange={handleViewChange} labelId='view-by' label='View By' size='small'>
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='collapsed'>Collapsed</MenuItem>
              <MenuItem value='normal'>Normal</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default FilterBox
