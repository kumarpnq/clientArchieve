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
import { useSelector, useDispatch } from 'react-redux'
import {
  customDashboardsScreensWithCharts,
  selectSelectedClient,
  setFetchAfterReportsChange
} from 'src/store/apps/user/userSlice'

const AddScreen = ({ open, setOpen, reportId, path }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [selectedDashboard, setSelectedDashboard] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [userDashboardIdForApi, setUserDashboardIdForApi] = useState('')
  const openMenu = Boolean(anchorEl)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const chartList = useSelector(customDashboardsScreensWithCharts)
  const dispatch = useDispatch()

  const [DBConfig, setDBConfig] = useState({
    userDashboardId: [],
    userDashBoardName: []
  })

  useEffect(() => {
    const userDashboardId = (chartList && chartList?.map(dashboard => dashboard.userDashboardId)) || []
    const userDashBoardName = (chartList && chartList?.map(dashboard => dashboard.userDashboardName)) || []

    setDBConfig({ userDashboardId, userDashBoardName })
  }, [chartList])

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
      const dId = chartList.find(item => item.userDashboardName === value).userDashboardId
      setUserDashboardIdForApi(dId)
    }
  }

  const validateTitle = title => {
    const words = title.split(' ')
    for (let word of words) {
      if (word.charAt(0) !== word.charAt(0).toUpperCase()) {
        return false
      }
    }

    return true
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validateTitle(title)) {
      setError("Each word's first letter should be uppercase.")

      return
    }

    setError('')

    try {
      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`
      }
      const actionType = DBConfig.userDashBoardName.includes(selectedDashboard) ? 'add' : 'create'
      const isPath = DBConfig.userDashBoardName.includes(selectedDashboard)
      const isDbId = DBConfig.userDashBoardName.includes(selectedDashboard) ? 'dashboardId' : 'dashboardName'
      const dbIdValue = isDbId === 'dashboardId' ? userDashboardIdForApi : title

      const requestData = {
        clientId,
        [isDbId]: dbIdValue,
        reportId,
        action: actionType
      }
      if (!isPath) {
        requestData.path = path
      }
      const response = await axios.post(`${BASE_URL}/updateUserDashboards`, requestData, { headers })

      if (response.status === 200) {
        dispatch(setFetchAfterReportsChange(true))
      }
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
            {DBConfig?.userDashBoardName?.map(i => (
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
          disabled={DBConfig.userDashBoardName.includes(title)}
          error={!!error} // Set error state
          helperText={error}
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
