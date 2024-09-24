import { Box, IconButton, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { useState } from 'react'

const SelectBox = props => {
  const { icon, iconButtonProps, menuItems = [], selectedItems = [], setSelectedItems, renderItem, renderKey } = props

  const [anchorEl, setAnchorEl] = useState(null)

  const handleToggle = item => {
    const itemKey = item[renderKey]
    const isSelected = selectedItems.some(selectedItem => selectedItem[renderKey] === itemKey)

    const updatedSelectedItems = isSelected
      ? selectedItems.filter(selectedItem => selectedItem[renderKey] !== itemKey)
      : [...selectedItems, item]

    setSelectedItems(updatedSelectedItems)
  }

  return (
    <Box>
      <IconButton
        {...iconButtonProps}
        onClick={event => setAnchorEl(event.currentTarget)}
        disabled={!menuItems?.length}
        aria-haspopup='true'
      >
        {icon}
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {menuItems.map(item => (
          <MenuItem key={item[renderKey]} onClick={() => handleToggle(item)}>
            <Checkbox
              checked={selectedItems.some(selectedItem => selectedItem[renderKey] === item[renderKey])}
              onChange={() => handleToggle(item)}
            />
            <ListItemText primary={item[renderItem]} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SelectBox
