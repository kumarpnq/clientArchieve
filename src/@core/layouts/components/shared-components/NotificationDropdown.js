import React, { useState, Fragment, useEffect } from 'react'
import {
  IconButton,
  Badge,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container
} from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import toast from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import useFetchNotifications from 'src/api/notifications/useFetchNotifications'
import useUpdateClientNotification from 'src/api/notifications/useUpdateReadClientNotification'
import { selectNotificationFlag, selectSelectedClient, setNotificationFlag } from 'src/store/apps/user/userSlice'
import useAutoNotification from 'src/api/notifications/useAutoNotificationStatus'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import Link from 'next/link'

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

const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

const MenuItemTitle = styled(Typography)({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
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

  const [anchorEl, setAnchorEl] = useState(null)
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const { notificationList, loading } = useFetchNotifications()
  const { loading: updateLoading, error, data, updateReadClientNotification } = useUpdateClientNotification()
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [clientData, setClientData] = useState(null)

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      const getUserName = JSON.parse(localStorage.getItem('userData'))?.email

      const response = await axios.get(`${process.env.NEXT_PUBLIC_JOB_SERVER}/clientArchiveNotificationList/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params: {
          clientId: clientId,
          userId: getUserName
        }
      })
      setClientData(response.data.jobList)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    if (clientId) {
      fetchData()
    }
  }, [anchorEl])

  const handleNotificationDetails = (jobId, status) => {
    if (status) return
    fetchData()
    updateReadClientNotification(jobId)
    dispatch(setNotificationFlag(!notificationFlag))
    if (error) {
      toast.error('something wrong.')
    } else {
      toast.success(data?.message || 'Successfully read.')
    }
  }

  const handleReadAll = () => {
    updateReadClientNotification()
    dispatch(setNotificationFlag(!notificationFlag))
    if (error) {
      toast.error('something wrong.')
    } else {
      toast.success(data?.message || 'Successfully read.')
    }
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const RenderAvatar = ({ notification }) => {
    const { avatarAlt, avatarImg, avatarIcon, avatarText, avatarColor } = notification
    if (avatarImg) {
      return <Avatar alt={avatarAlt} src={avatarImg} />
    } else if (avatarIcon) {
      return (
        <Avatar skin='light' color={avatarColor}>
          {avatarIcon}
        </Avatar>
      )
    } else {
      return (
        <Avatar skin='light' color={avatarColor}>
          {getInitials(avatarText)}
        </Avatar>
      )
    }
  }

  // * color variables
  const red = '#FFB6C1' // Light Red
  const green = '#90EE90' // Light Green
  const yellow = '#FFFFE0' // Light Yellow

  const dataArray = notificationList?.excelDump || []
  const unreadJobs = dataArray.filter(job => !job.readJobStatus)
  const notificationListCount = unreadJobs?.length

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
            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`
                ${notificationListCount} New`}
            />
          </Box>
        </MenuItem>

        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <>
            {clientData?.excelDump.length > 0 && (
              <Box sx={{ maxWidth: '400px', pr: 12 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='subtitle2'>ExcelDump</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      maxHeight: '300px',
                      overflowY: 'scroll', // Keep vertical scrollbar
                      overflowX: 'hidden', // Hide horizontal scrollbar
                      maxWidth: '400px',

                      // Hide horizontal scrollbar styling for WebKit browsers
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      msOverflowStyle: 'none' /* IE and Edge */,
                      scrollbarWidth: 'none' /* Firefox */
                    }}
                  >
                    {clientData &&
                      clientData.excelDump.map((job, index) => (
                        <MenuItem
                          key={index}
                          disableRipple
                          disableTouchRipple
                          sx={{
                            cursor: 'default',
                            userSelect: 'auto',
                            backgroundColor: 'transparent !important'
                          }}
                        >
                          <Accordion sx={{ maxWidth: '300px' }}>
                            <AccordionSummary
                              content='test'
                              expandIcon={<ExpandMoreIcon />}
                              onClick={() => {
                                handleNotificationDetails(job.jobId, job.readJobStatus)
                              }}
                            >
                              <Container
                                component={'span'}
                                fontSize={'0.9em'}
                                sx={{
                                  bgcolor:
                                    job.jobStatus === 'Processing'
                                      ? yellow
                                      : job.jobStatus === 'Completed'
                                      ? green
                                      : red,
                                  color: 'text.primary',
                                  borderRadius: '2px',
                                  fontSize: '0.9em',
                                  fontWeight: 100,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {job.readJobStatus && (
                                  <CustomTooltip title='Allready read'>
                                    <CheckIcon fontSize='small' />
                                  </CustomTooltip>
                                )}

                                {job.jobName.substring(0, 30) + '...'}
                              </Container>
                            </AccordionSummary>
                            <AccordionDetails>
                              <CustomTooltip title={job.jobName}>
                                <Typography key={job.jobId} fontSize={'0.9em'}>
                                  {job.jobName.substring(0, 30) + '...'}
                                </Typography>
                              </CustomTooltip>
                              <Typography fontSize={'0.9em'}>Status: {job.jobStatus}</Typography>
                              {job.downloadLink !== null && (
                                <Typography fontSize={'0.9em'}>
                                  Download Link:{' '}
                                  <Link href={`${process.env.NEXT_PUBLIC_JOB_SERVER}/downloadFile/${job.downloadLink}`}>
                                    link
                                  </Link>
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </MenuItem>
                      ))}
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {clientData?.dossier.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant='h5'>Dossier</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {clientData &&
                    clientData.dossier.map((job, index) => (
                      <MenuItem
                        key={index}
                        disableRipple
                        disableTouchRipple
                        sx={{
                          cursor: 'default',
                          userSelect: 'auto',
                          backgroundColor: 'transparent !important'
                        }}
                      >
                        <Accordion style={{ width: '100%' }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box
                              component='span'
                              bgcolor={job.jobStatus === 'Processing' ? yellow : green}
                              color='text.primary'
                              borderRadius='2px'
                            >
                              {job.jobName}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography key={job.jobId}>{job.jobName}</Typography>
                            <Typography>Status: {job.jobStatus}</Typography>
                            <Typography>Download Link: {job.downloadLink}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      </MenuItem>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}

            {clientData?.mail.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant='h5'>Mail</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {clientData &&
                    clientData.mail.map((job, index) => (
                      <MenuItem
                        key={index}
                        disableRipple
                        disableTouchRipple
                        sx={{
                          cursor: 'default',
                          userSelect: 'auto',
                          backgroundColor: 'transparent !important'
                        }}
                      >
                        <Accordion style={{ width: '100%' }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box
                              component='span'
                              bgcolor={job.jobStatus === 'Processing' ? yellow : green}
                              color='text.primary'
                              borderRadius='2px'
                            >
                              {job.jobName}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography key={job.jobId}>{job.jobName}</Typography>
                            <Typography>Status: {job.jobStatus}</Typography>
                            <Typography>Download Link: {job.downloadLink}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      </MenuItem>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}
          </>
        </MenuItem>
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
