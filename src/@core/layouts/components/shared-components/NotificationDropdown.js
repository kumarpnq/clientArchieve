import React, { useState, Fragment, useEffect } from 'react'
import { IconButton, Badge, Typography, Button, Link, Box } from '@mui/material'
import UseBgColor from 'src/@core/hooks/useBgColor'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import toast from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'
import useFetchNotifications from 'src/api/notifications/useFetchNotifications'
import useUpdateClientNotification from 'src/api/notifications/useUpdateReadClientNotification'
import { selectNotificationFlag, selectSelectedClient, setNotificationFlag } from 'src/store/apps/user/userSlice'
import useAutoNotification from 'src/api/notifications/useAutoNotificationStatus'
import axios from 'axios'
import { BASE_URL, JOB_SERVER } from 'src/api/base'

const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

const IconWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
)

const NotificationDropdown = () => {
  useAutoNotification()

  // * hooks
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const bgColors = UseBgColor()
  const { loading: updateLoading, error, data, updateReadClientNotification } = useUpdateClientNotification()

  const [anchorEl, setAnchorEl] = useState(null)
  const { notificationList, loading } = useFetchNotifications()
  const selectedClient = useSelector(selectSelectedClient)
  const [activeIconFilter, setActiveIconFilter] = useState('all')
  const [filteredData, setFilteredData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const unreadNotifications = filteredData?.filter(item => !item.readJobStatus)
  const clientId = selectedClient ? selectedClient.clientId : null

  const colors = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight }
  }

  useEffect(() => {
    if (notificationList) {
      setFilteredData([
        ...(notificationList.excelDump || []),
        ...(notificationList.mail || []),
        ...(notificationList.dossier || [])
      ])
    }
  }, [notificationList])

  const markAsSeen = async () => {
    const unreadItems = unreadNotifications.map(item => item.jobId)
    if (unreadItems.length > 0) {
      try {
        await Promise.all(unreadItems.map(jobId => updateReadClientNotification(jobId)))
        dispatch(setNotificationFlag(!notificationFlag))
      } catch (error) {
        toast.error('Error marking notifications as seen.')
      }
    }
  }

  const handleReadAll = () => {
    updateReadClientNotification()
    dispatch(setNotificationFlag(!notificationFlag))
    if (error) {
      toast.error('something wrong.')
    } else {
      // toast.success(data?.message || 'Successfully read.')
      console.log('Success')
    }
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
    markAsSeen()
  }

  const handleDropdownClose = () => setAnchorEl(null)

  const handleIconClick = value => {
    setActiveIconFilter(value)

    let filtered
    if (value === 'all') {
      // Combine all arrays into one
      filtered = [...notificationList.excelDump, ...notificationList.mail, ...notificationList.dossier]
    } else {
      filtered = notificationList[value]
    }
    setFilteredData(filtered)
  }

  const handleDoubleClick = item => {
    setSelectedData(prev => {
      if (prev.some(selectedItem => selectedItem.jobId === item.jobId)) {
        return prev.filter(selectedItem => selectedItem.jobId !== item.jobId)
      } else {
        return [...prev, item]
      }
    })
  }

  const isSelected = item => selectedData.some(selectedItem => selectedItem.jobId === item.jobId)

  // * delete notifications
  const handleRemoveNotifications = async () => {
    console.log(selectedData)
    const jobIds = selectedData.map(i => i.jobId)
    console.log(jobIds)

    try {
      const request_data = {
        clientId,
        jobIds
      }
      const token = localStorage.getItem('accessToken')

      const response = await axios.post(`${JOB_SERVER}/deleteNotifications`, request_data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
      if (response.status === 200) {
        toast.success('Notification deleted.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const dataArray = notificationList?.excelDump || []
  const unreadJobs = dataArray.filter(job => !job.readJobStatus)
  const notificationListCount = unreadJobs?.length

  // * date format
  const formatDate = dateString => {
    const date = new Date(dateString)

    const hoursAndMinutes = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    const day = date.toLocaleString('en-US', { day: 'numeric' })
    const month = date.toLocaleString('en-US', { month: 'short' })

    return `${day} ${month}, ${hoursAndMinutes}`
  }

  const DownloadLink = ({ item, dumpType }) =>
    dumpType === 'mail' ? (
      <></>
    ) : (
      <Typography variant='body2' display='flex' alignItems='center'>
        <Link
          href={`${process.env.NEXT_PUBLIC_JOB_SERVER}/downloadFile/${item.downloadLink}`}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Click Here <Icon icon='fluent-mdl2:down' style={{ fontSize: '0.9em' }} />
        </Link>
      </Typography>
    )

  return (
    <Fragment>
      <IconButton color='primary' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={!notificationListCount.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon fontSize='1.625rem' icon='tabler:bell' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={`
                ${notificationListCount} New`}
              />
              <Typography
                onClick={() => {
                  setSelectedData(selectedData.length === filteredData?.length ? [] : [...filteredData])
                }}
              >
                <CustomChip
                  skin='light'
                  size='small'
                  color='primary'
                  label={selectedData.length === filteredData?.length ? 'None' : 'All'}
                />
              </Typography>
              {!!selectedData.length && (
                <CustomTooltip title='Delete'>
                  <Badge badgeContent={selectedData.length} color='primary'>
                    <Typography color='primary' onClick={handleRemoveNotifications}>
                      <Icon icon={'material-symbols-light:delete-outline'} />
                    </Typography>
                  </Badge>
                </CustomTooltip>
              )}
            </Box>
          </Box>
        </MenuItem>
        <MenuItem disableRipple disableTouchRipple sx={{ height: 50 }}>
          <IconWrapper>
            <IconButton
              sx={{
                fontSize: '1.2em',
                fontWeight: 'bold',
                backgroundColor: activeIconFilter === 'all' ? 'primary.main' : '',
                color: activeIconFilter === 'all' ? 'text.secondary' : ''
              }}
              onClick={() => handleIconClick('all')}
            >
              All
            </IconButton>
            <IconButton
              onClick={() => handleIconClick('excelDump')}
              sx={{
                backgroundColor: activeIconFilter === 'excelDump' ? 'primary.main' : '',
                color: activeIconFilter === 'excelDump' ? 'text.secondary' : ''
              }}
            >
              <Icon icon='ri:file-excel-fill' />
            </IconButton>
            <IconButton
              onClick={() => handleIconClick('mail')}
              sx={{
                backgroundColor: activeIconFilter === 'mail' ? 'primary.main' : '',
                color: activeIconFilter === 'mail' ? 'text.secondary' : ''
              }}
            >
              <Icon icon='ic:baseline-mail' />
            </IconButton>
            <IconButton
              onClick={() => handleIconClick('dossier')}
              sx={{
                backgroundColor: activeIconFilter === 'dossier' ? 'primary.main' : '',
                color: activeIconFilter === 'dossier' ? 'text.secondary' : ''
              }}
            >
              <Icon icon='mdi:download-box' />
            </IconButton>
          </IconWrapper>
        </MenuItem>
        {/* <MenuItem> */}
        <PerfectScrollbar>
          {filteredData?.map((item, index) => (
            <MenuItem
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'text',
                backgroundColor: isSelected(item) ? colors.primary : 'transparent'
              }}
              onDoubleClick={() => handleDoubleClick(item)}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: item.readJobStatus ? 'text.primary' : 'green',
                    borderRadius: '50%',
                    marginLeft: '10px'
                  }}
                />
                <Typography variant='body2'>{item.jobName.substring(0, 27) + '...'}</Typography>

                <Typography variant='body2' fontSize={'0.7em'}>
                  {formatDate(item.jobRequestTime)}
                </Typography>
              </Box>

              <Box sx={{ width: '85%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {activeIconFilter === 'all' && <Typography variant='body2'>{item.jobType}</Typography>}
                {item.jobStatus === 'Completed' && activeIconFilter !== 'mail' ? (
                  <DownloadLink item={item} dumpType={item.jobType} />
                ) : (
                  <Typography variant='body2'>{item.jobStatus}</Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </PerfectScrollbar>
        {/* </MenuItem> */}
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleReadAll}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
