import { Box, IconButton, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { useState, useEffect } from 'react'

const SelectBox = props => {
  const { icon, iconButtonProps, menuItems = [], selectedItems = [], setSelectedItems, renderItem, renderKey } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [localSelectedItems, setLocalSelectedItems] = useState(selectedItems)

  useEffect(() => {
    setLocalSelectedItems(selectedItems)
  }, [selectedItems])

  const handleToggle = item => {
    const itemKey = item[renderKey]
    const isSelected = localSelectedItems.some(selectedItem => selectedItem[renderKey] === itemKey)

    const updatedSelectedItems = isSelected
      ? localSelectedItems.filter(selectedItem => selectedItem[renderKey] !== itemKey)
      : [...localSelectedItems, item]

    setLocalSelectedItems(updatedSelectedItems)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedItems(localSelectedItems)
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} disableAutoFocusItem>
        {menuItems.map(item => (
          <MenuItem key={item[renderKey]} disableRipple>
            <Checkbox
              checked={localSelectedItems.some(selectedItem => selectedItem[renderKey] === item[renderKey])}
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
