import { Box, IconButton, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { useState } from 'react'

const SelectBox = props => {
  const { icon, iconButtonProps, menuItems = [], selectedItems = [], setSelectedItems, renderItem, renderKey } = props

  // State variable for menu open/close
  const [anchorE1, setAnchorE1] = useState(null)

  const handleToggle = item => {
    const itemKey = item[renderKey]
    const isSelected = selectedItems.some(selectedItem => selectedItem[renderKey] === itemKey)

    let updatedSelectedItems
    if (isSelected) {
      updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem[renderKey] !== itemKey)
    } else {
      updatedSelectedItems = [...selectedItems, item]
    }

    // Update selected items state in parent
    setSelectedItems(updatedSelectedItems)
  }

  return (
    <Box>
      <IconButton
        {...iconButtonProps}
        onClick={event => setAnchorE1(event.currentTarget)}
        disabled={!menuItems?.length}
        aria-haspopup='true'
      >
        {icon}
      </IconButton>

      <Menu anchorEl={anchorE1} open={Boolean(anchorE1)} onClose={() => setAnchorE1(null)}>
        {menuItems.map(item => (
          <MenuItem key={item[renderKey]}>
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
