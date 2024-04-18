import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import WebIcon from '@mui/icons-material/Web'
import { IconButton, Menu, MenuItem } from '@mui/material'

// ** redux import
import { setSelectedMedia, selectSelectedMedia } from 'src/store/apps/user/userSlice'

const Media = props => {
  const { settings } = props

  // ** Vars
  const { direction } = settings
  const dispatch = useDispatch()
  const selectedMedia = useSelector(selectSelectedMedia)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = mediaType => {
    dispatch(setSelectedMedia(mediaType))
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton onClick={handleIconClick} color='primary' aria-haspopup='true'>
        <WebIcon fontSize='1.625rem' />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ mt: 4.25, minWidth: 200 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem onClick={() => handleMenuItemClick('print')} selected={selectedMedia === 'print'}>
          Print
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('online')} selected={selectedMedia === 'online'}>
          Online
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('printAndOnline')} selected={selectedMedia === 'printAndOnline'}>
          Print & Online
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default Media
