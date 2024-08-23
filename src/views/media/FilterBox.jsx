import React, { useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const FilterBox = ({ setCardData }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSort = sortBy => {
    setCardData(prevCardData =>
      prevCardData.map(company => ({
        ...company,
        feeds: [...company.feeds].sort((a, b) => b.stats[sortBy] - a.stats[sortBy])
      }))
    )
    handleClose()
  }

  return (
    <Box>
      <IconButton onClick={handleClick} sx={{ color: 'primary.main' }}>
        <IconifyIcon icon='material-symbols:sort' />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSort('likeCount')} sx={{ display: 'flex', gap: 1 }}>
          <IconifyIcon icon='basil:like-outline' />
          Likes
        </MenuItem>
        <MenuItem onClick={() => handleSort('followersCount')} sx={{ display: 'flex', gap: 1 }}>
          <IconifyIcon icon='icon-park-outline:peoples' />
          Followers
        </MenuItem>
        <MenuItem onClick={() => handleSort('impression_count')} sx={{ display: 'flex', gap: 1 }}>
          <IconifyIcon icon='hugeicons:analytics-01' />
          Views
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default FilterBox
