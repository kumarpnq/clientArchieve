import { Fragment, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** third party import
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

// ** redux
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const AddScreen = ({ open, setOpen, reportId, path }) => {
  console.log(path)
  const [title, setTitle] = useState('')
  const [selectedDashboard, setSelectedDashboard] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

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
  const DBTitles = ['My Dashboard']

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`
      }
      const actionType = DBTitles.includes(selectedDashboard) ? 'add' : 'create'
      const isPath = DBTitles.includes(selectedDashboard)
      const isDbId = DBTitles.includes(selectedDashboard) ? 'dashboardId' : 'dashBoardName'

      const requestData = {
        clientId,
        [isDbId]: selectedDashboard || title,
        reportId,
        action: actionType
      }
      if (!isPath) {
        requestData.path = path
      }
      const response = await axios.post(`${BASE_URL}/updateUserDashboards`, requestData, { headers })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
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
