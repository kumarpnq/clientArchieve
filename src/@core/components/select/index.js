import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const SelectBox = props => {
  const { icon, iconButtonProps, menuItems = [], selectedItems = [], setSelectedItems, renderItem, renderKey } = props

  // State variable
  const [anchorE1, setAnchorE1] = useState(null)
  const [isMenuSelected, setIsMenuSelected] = useState({})

  const handelMenuSelected = item => {
    const itemKey = item[renderKey]
    const isSelected = selectedItems.some(selectedItem => selectedItem[renderKey] === itemKey)

    let updatedSelectedItems
    if (isSelected) {
      updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem[renderKey] !== itemKey)
    } else {
      updatedSelectedItems = [...selectedItems, item]
    }

    setSelectedItems(updatedSelectedItems)
    setIsMenuSelected(prevState => ({
      ...prevState,
      [itemKey]: !isSelected
    }))
  }

  return (
    <Box>
      <IconButton {...iconButtonProps} onClick={event => setAnchorE1(event.currentTarget)} aria-haspopup='true'>
        {icon}
      </IconButton>

      <Menu anchorEl={anchorE1} open={Boolean(anchorE1)} onClose={() => setAnchorE1(null)}>
        {menuItems.map(item => (
          <MenuItem
            key={item[renderKey]}
            onClick={() => handelMenuSelected(item)}
            selected={isMenuSelected[item[renderKey]]}
          >
            {item[renderItem]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SelectBox
