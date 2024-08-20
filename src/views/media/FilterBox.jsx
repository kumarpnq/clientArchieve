import React, { useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const FilterBox = ({ cardData, setSelectedCards, setIsSelectCard, isSelectCard, setCardData, isSecure }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [viewAnchorEl, setViewAnchorEl] = useState(null)
  const [sortOption, setSortOption] = useState('')
  const [viewOption, setViewOption] = useState('')
  const [isAllSelected, setIsAllSelected] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSortAnchorEl(null)
    setViewAnchorEl(null)
  }

  const handleSortClick = event => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleViewClick = event => {
    setViewAnchorEl(event.currentTarget)
  }

  const handleSortChange = (option, value) => {
    setSortOption(option)
    handleClose()
    sortData(value)
  }

  const handleViewChange = option => {
    setViewOption(option)
    handleClose()
  }

  const sortData = option => {
    setCardData(prevCardData => {
      let sortedData = [...prevCardData]
      if (option === 'likeCount' || option === 'followersCount' || option === 'impression_count') {
        sortedData.sort((a, b) => b.stats[option] - a.stats[option])
      }

      return sortedData
    })
  }

  const handleSelectAll = () => {
    if (isSelectCard) {
      setIsSelectCard(prev => !prev)
      setSelectedCards([])
      setIsAllSelected(false)
    } else {
      setIsSelectCard(prev => !prev)
      setSelectedCards([...cardData])
      setIsAllSelected(true)
    }
  }

  return (
    <Box>
      <IconButton onClick={handleClick} sx={{ color: 'primary.main' }}>
        <IconifyIcon icon='oui:filter' />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {isSecure && (
          <>
            <MenuItem onClick={() => setIsSelectCard(prev => !prev)} selected={isSelectCard}>
              Select
            </MenuItem>
            <MenuItem onClick={handleSelectAll} selected={isAllSelected}>
              Select All
            </MenuItem>
          </>
        )}

        <MenuItem onClick={handleSortClick}>Sort By: {sortOption || 'None'}</MenuItem>
        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleSortChange('')}>None</MenuItem>
          <MenuItem onClick={() => handleSortChange('Likes', 'likeCount')}>Likes</MenuItem>
          <MenuItem onClick={() => handleSortChange('Followers', 'followersCount')}>Followers</MenuItem>
          <MenuItem onClick={() => handleSortChange('Views', 'impression_count')}>Views</MenuItem>
        </Menu>
        {/* <MenuItem onClick={handleViewClick}>View By: {viewOption || 'None'}</MenuItem>
          <Menu anchorEl={viewAnchorEl} open={Boolean(viewAnchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => handleViewChange('')}>None</MenuItem>
            <MenuItem onClick={() => handleViewChange('collapsed')}>Collapsed</MenuItem>
            <MenuItem onClick={() => handleViewChange('normal')}>Normal</MenuItem>
          </Menu> */}
      </Menu>
    </Box>
  )
}

export default FilterBox
