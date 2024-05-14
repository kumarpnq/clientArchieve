import { Fragment, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** components import

const AddScreen = ({ open, setOpen }) => {
  const [title, setTitle] = useState()
  const [selectedDashboard, setSelectedDashboard] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMenuClick = value => {
    if (selectedDashboard === value) {
      setSelectedDashboard('')
      setTitle('')
    } else {
      setSelectedDashboard(value)
      setTitle(value)
    }
  }
  const DBTitles = ['Dashboard1', 'Dashboard2', 'Dashboard3']

  const handleSubmit = event => {
    event.preventDefault()

    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>Dashboard Title</DialogTitle>
      <DialogContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Fragment>
          <Button
            id='basic-button'
            aria-controls={openMenu ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleClick}
          >
            My Dashboards
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            {DBTitles.map(i => (
              <MenuItem onClick={() => handleMenuClick(i)} key={i} selected={selectedDashboard === i}>
                {i}
              </MenuItem>
            ))}
          </Menu>
        </Fragment>
        <TextField
          autoFocus
          required
          size='small'
          margin='dense'
          id='name'
          name='text'
          label='title'
          type='text'
          variant='outlined'
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={DBTitles.includes(title)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit'>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddScreen
