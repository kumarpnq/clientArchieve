import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { selectedDateType, setSelectedDateType } from 'src/store/apps/user/userSlice'
import IconifyIcon from 'src/@core/components/icon'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import ArticleIcon from '@mui/icons-material/Article'

const DateType = props => {
  const { settings } = props
  const selectedDate = useSelector(selectedDateType)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)

  // ** Vars
  const { direction } = settings

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = dateType => {
    dispatch(setSelectedDateType(dateType)) // Dispatch the action with the selected date type
    handleClose() // Close the menu after selecting an item
  }

  const displayValue = selectedDate === 'UD' ? <ArticleIcon /> : <DriveFolderUploadIcon />

  return (
    <Fragment>
      <IconButton
        sx={{ fontSize: '1em', color: 'primary.main' }}
        color='primary'
        aria-haspopup='true'
        onClick={handleIconClick}
      >
        {displayValue}
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ mt: 4.25, minWidth: 200 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem onClick={() => handleClick('AD')} selected={selectedDate === 'AD'}>
          Article Date
        </MenuItem>
        <MenuItem onClick={() => handleClick('UD')} selected={selectedDate === 'UD'}>
          Upload Date
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default DateType
