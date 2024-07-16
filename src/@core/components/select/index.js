import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'

const SelectBox = props => {
  const { icon, iconButtonProps, menuItems = [], selectedItems = [], setSelectedItems, renderItem, renderKey } = props

  // State variable
  const [anchorE1, setAnchorE1] = useState(null)
  const [isMenuSelected, setIsMenuSelected] = useState({})

  // Handle item select function

  // const handleItemSelect = itemKey => {
  //   const selectedIndex = selectedItems.indexOf(itemKey)
  //   let newSelected = []

  //   if (selectedIndex === -1) {
  //     // Item not yet selected, add it to selectedItems
  //     newSelected = [...selectedItems, itemKey]
  //   } else {
  //     // Item already selected, remove it from selectedItems
  //     newSelected = selectedItems.filter(key => key !== itemKey)
  //   }

  //   // Update selectedItems state
  //   setSelectedItems(newSelected)
  // }

  const handelMenuSelected = itemrow => {
    if (isMenuSelected[itemrow]) {
      setIsMenuSelected(prv => {
        return {
          ...prv,
          [itemrow]: false
        }
      })
    } else {
      setIsMenuSelected(prv => {
        return {
          ...prv,
          [itemrow]: true
        }
      })
    }

    // setIsMenuSelected({ [itemrow]: true })
  }

  useEffect(() => {
    console.log('menusle==>', isMenuSelected)
  }, [isMenuSelected])

  return (
    <Box>
      <IconButton {...iconButtonProps} onClick={event => setAnchorE1(event.currentTarget)} aria-haspopup='true'>
        {icon}
      </IconButton>

      <Menu anchorEl={anchorE1} open={Boolean(anchorE1)} onClose={() => setAnchorE1(null)}>
        {menuItems.map(item => (
          <MenuItem
            key={item[renderKey]}
            onClick={(e, v) => {
              handelMenuSelected(item[renderKey])

              // e.target.setAttribute('checked', true)
              // handleItemSelect(item[renderKey])
            }}
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
