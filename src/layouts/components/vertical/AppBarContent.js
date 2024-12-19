import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'

// ** Icon Imports
import IconifyIcon from 'src/@core/components/icon'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

// import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import ClientDropdown from 'src/@core/layouts/components/shared-components/ClientDropdown'
import Competition from 'src/@core/layouts/components/shared-components/CompetitionDropdown'
import DateBar from 'src/@core/layouts/components/shared-components/DatePicker'
import DaysJumper from 'src/@core/layouts/components/shared-components/DaysJumper'
import Media from 'src/@core/layouts/components/shared-components/MediaDropDown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

// ** redux
import { BASE_URL } from 'src/api/base'
import { useSelector, useDispatch } from 'react-redux'
import {
  setShotCutPrint,
  selectShortCut,
  selectSelectedStartDate,
  selectSelectedEndDate
} from 'src/store/apps/user/userSlice'

// * third party imports
import axios from 'axios'
import DateType from 'src/@core/layouts/components/shared-components/DateType'
import { Tooltip } from 'recharts'

import { Button, Menu, Stack, tooltipClasses, Typography } from '@mui/material'
import styled from '@emotion/styled'
import toast from 'react-hot-toast'
import { CloseOutlined } from '@mui/icons-material'
import dayjs from 'dayjs'
import Filters from 'src/@core/layouts/components/filters'
import useMenu from 'src/hooks/useMenu'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getDateRange, setDateFrom, setDateTo } from 'src/store/apps/filters/filterSlice'
import CloseIcon from '@mui/icons-material/Close'
import DateRangeIcon from '@mui/icons-material/DateRange'

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Floras! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      fontSize: 11,
      maxWidth: '300px',
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.default
      }
    }
  })
)

const AppBarContent = props => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const startDateForPrint = useSelector(selectSelectedStartDate)
  const endDateForPrint = useSelector(selectSelectedEndDate)
  const date = dayjs(startDateForPrint).add(1, 'day')
  const endDate = dayjs(endDateForPrint)
  const { anchorEl: anchorElDate, openMenu: openDate, closeMenu: closeDate } = useMenu()
  const { from, to } = useSelector(getDateRange)

  // Format the date
  const formattedDate = date.format('DD-MMM').toUpperCase()
  const formattedEndDate = endDate.format('DD-MMM').toUpperCase()

  const [dataShort, setDataShort] = useState([])

  // ** Hook
  const auth = useAuth()
  const router = useRouter()
  const currentRoute = router.pathname

  const isDashboardRoute = useMemo(() => currentRoute.startsWith('/dashboards'), [currentRoute])
  const isOnAnalyticsPage = currentRoute === '/dashboards/analytics'
  const isOnVisibilityImageQePage = currentRoute === '/dashboards/visibility-image-qe'
  const isOnTonalityPage = currentRoute === '/dashboards/tonality'
  const isOnPeersPage = currentRoute === '/dashboards/peers'
  const isOnPerformancePage = currentRoute === '/dashboards/performance'
  const isMedia = currentRoute === '/media'
  const isBothNews = currentRoute === '/headlines/print-online'

  const isShowMedia =
    isOnAnalyticsPage || isOnVisibilityImageQePage || isOnTonalityPage || isOnPeersPage || isOnPerformancePage

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getUserConfigDetails`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        setDataShort(response?.data?.configData)

        // dispatch(setShotCutPrint(response?.data?.configData))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {hidden && !settings.navHidden ? (
            <IconButton color='primary' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
              <IconifyIcon fontSize='1.5rem' icon='tabler:menu-2' />
            </IconButton>
          ) : null}
          {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
        </Box>
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          {isDashboardRoute ? (
            <Button
              startIcon={<DateRangeIcon />}
              variant={'outlined'}
              onClick={openDate}
              sx={{
                py: 1,
                px: 2
              }}
            >
              Date Range
            </Button>
          ) : null}
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          {auth.user && (
            <>
              <ShortcutsDropdown settings={settings} shortcuts={dataShort} />
              <NotificationDropdown settings={settings} notifications={notifications} />
              <ClientDropdown />
              <UserDropdown settings={settings} />
            </>
          )}
        </Box>
      </Box>
      {isDashboardRoute
        ? null
        : auth.user && (
            <>
              <Divider sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box>
                  <Competition settings={settings} />

                  {isShowMedia && <Media settings={settings} />}
                </Box>
                <Box>
                  <DateBar />
                  {isBothNews && (
                    <Typography
                      component={'span'}
                      sx={{ color: 'primary.main', fontSize: '1.5em' }}
                      onClick={() => {
                        toast(t => (
                          <span>
                            <Typography sx={{ textAlign: 'right' }}>
                              <IconButton onClick={() => toast.dismiss(t.id)} size='small'>
                                <CloseOutlined />
                              </IconButton>
                            </Typography>
                            <Typography sx={{ color: 'primary.main', fontSize: '0.9em' }}>
                              Print news from {formattedDate} : {formattedEndDate}.
                            </Typography>
                          </span>
                        ))
                      }}
                    >
                      <div style={{ display: 'inline', cursor: 'pointer', color: '#28C76F' }}>*</div>
                    </Typography>
                  )}

                  <DaysJumper settings={settings} />
                  {!isMedia && <DateType settings={settings} />}
                </Box>
              </Box>
            </>
          )}

      {isDashboardRoute ? <Filters /> : null}

      <Menu
        anchorEl={anchorElDate}
        open={Boolean(anchorElDate)}
        onClose={closeDate}
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 300px)',
            px: 4,
            pt: 1,
            pb: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            maxHeight: 450,
            overflow: 'auto',

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='subtitle01' fontWeight={500}>
            Date Range
          </Typography>
          <IconButton onClick={closeDate}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant='body2' color='text.tertiary' fontWeight={500} gutterBottom>
            From
          </Typography>
          <DateTimePicker
            slotProps={{
              textField: { size: 'small', fullWidth: true }
            }}
            sx={{ mb: 2 }}
            value={from}
            onChange={date => dispatch(setDateFrom(date))}
          />
          <Typography variant='body2' color='text.tertiary' fontWeight={500} gutterBottom>
            To
          </Typography>
          <DateTimePicker
            slotProps={{
              textField: { size: 'small', fullWidth: true }
            }}
            value={to}
            onChange={date => dispatch(setDateTo(date))}
          />
        </LocalizationProvider>
      </Menu>
    </Box>
  )
}

export default AppBarContent
