import { Box, CircularProgress, IconButton, Menu, MenuItem, Paper, Tooltip, tooltipClasses } from '@mui/material'
import React, { useState } from 'react'
import XIcon from '@mui/icons-material/X'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import PinterestIcon from '@mui/icons-material/Pinterest'
import FilterBox from './FilterBox'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import styled from '@emotion/styled'
import { generateTableHtml } from './components/emailFormat'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MenuIcon from '@mui/icons-material/Menu'
import useMediaQuery from '@mui/material/useMediaQuery'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import clipboardCopy from 'clipboard-copy'
import toast from 'react-hot-toast'
import { BASE_URL } from 'src/api/base'
import { useSelector } from 'react-redux'
import { selectSelectedClient, selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import { formatDateTime } from 'src/utils/formatDateTime'
import axios from 'axios'
import dayjs from 'dayjs'
import MailDialog from './components/MailDialog'

// Styled outer Box component
const StyledOuterBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2)
}))

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

const Stepper = ({
  setCardData,
  setIsSelectCard,
  isSelectCard,
  selectedCards,
  setSelectedCards,
  isSecure,
  value,
  setValue
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [copyLoading, setCopyLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // * redux
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSendEmail = () => {
    setOpen(true)
  }

  // * function to format date time to date only
  const formatDate = dateTimeString => {
    return dayjs(dateTimeString).format('YYYY-MM-DD')
  }

  const generateWebURL = async () => {
    try {
      setCopyLoading(true)
      const storedToken = localStorage.getItem('accessToken')

      const params = {
        clientId,
        fromDate: formatDate(formattedStartDate),
        toDate: formatDate(formattedEndDate),
        mediaType: value
      }

      const response = await axios.get(`${BASE_URL}/encryptSocialMediaUrl`, {
        params,
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      const encryptedUrl = response.data.url

      clipboardCopy(`http://localhost:3000/SHARED_DASHBOARD/id=${encryptedUrl}`)
        .then(() => {
          toast.success('URL copied to clipboard!')
        })
        .catch(error => {
          console.error('Failed to copy URL: ', error)
          toast.error('Failed to copy URL.')
        })
    } catch (error) {
      toast.error('Failed to generate URL.')
    } finally {
      setCopyLoading(false)
    }
  }

  const handleMenuClick = event => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  return (
    <StyledOuterBox>
      <>
        {' '}
        {isMobile ? (
          <>
            <IconButton onClick={handleMenuClick} sx={{ color: 'primary.main' }}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} sx={{ mt: '45px' }}>
              <MenuItem onClick={() => setValue('all')}>All</MenuItem>
              <MenuItem onClick={() => setValue('twitter')}>X</MenuItem>
              {/* <MenuItem onClick={() => setValue('facebook')}>Facebook</MenuItem> */}
              <MenuItem onClick={() => setValue('youtube')}>YouTube</MenuItem>
              {/* <MenuItem onClick={() => setValue('instagram')}>Instagram</MenuItem> */}
              {/* <MenuItem onClick={() => setValue('pinterest')}>Pinterest</MenuItem> */}
            </Menu>
          </>
        ) : (
          <Box>
            <TabContext value={value}>
              <Box>
                <TabList onChange={handleChange} aria-label='lab API tabs example' variant='scrollable'>
                  <Tab
                    label={
                      <IconButton
                        sx={{ color: 'primary.main', fontSize: '1em', fontWeight: 'bold', letterSpacing: '1px' }}
                      >
                        All
                      </IconButton>
                    }
                    value='all'
                    sx={{ minWidth: 30 }}
                  />
                  <Tab
                    label={
                      <IconButton sx={{ color: 'primary.main' }}>
                        <XIcon fontSize='1em' />
                      </IconButton>
                    }
                    value='twitter'
                    sx={{ minWidth: 30 }}
                  />
                  {/* <Tab
                  label={
                    <IconButton sx={{ color: 'primary.main' }}>
                      <FacebookIcon ontSize='1em' />
                    </IconButton>
                  }
                  value='facebook'
                  sx={{ minWidth: 30 }}
                /> */}
                  <Tab
                    label={
                      <IconButton sx={{ color: 'primary.main' }}>
                        <YouTubeIcon ontSize='1em' />
                      </IconButton>
                    }
                    value='youtube'
                    sx={{ minWidth: 30 }}
                  />
                  {/* <Tab
                  label={
                    <IconButton sx={{ color: 'primary.main' }}>
                      <InstagramIcon ontSize='1em' />
                    </IconButton>
                  }
                  value='instagram'
                  sx={{ minWidth: 30 }}
                /> */}
                  {/* <Tab
                  label={
                    <IconButton sx={{ color: 'primary.main', fontSize: 35 }}>
                      <PinterestIcon ontSize='1em' />
                    </IconButton>
                  }
                  value='pinterest'
                  sx={{ minWidth: 30 }}
                /> */}
                </TabList>
              </Box>
            </TabContext>
          </Box>
        )}
      </>

      <Box sx={{ display: 'flex' }}>
        {isSecure && (
          <CustomTooltip title='Copy Dashboard URL.'>
            <IconButton onClick={generateWebURL} sx={{ color: 'primary.main' }}>
              {copyLoading ? <CircularProgress size={'0.9em'} /> : <ContentCopyIcon />}
            </IconButton>
          </CustomTooltip>
        )}

        {!!selectedCards.length && (
          <CustomTooltip title='Send as a Mail'>
            <IconButton onClick={handleSendEmail} sx={{ color: 'primary.main' }}>
              <MailOutlineIcon />
            </IconButton>
          </CustomTooltip>
        )}

        <FilterBox
          setIsSelectCard={setIsSelectCard}
          isSelectCard={isSelectCard}
          setCardData={setCardData}
          isSecure={isSecure}
        />
      </Box>
      <MailDialog
        open={open}
        setOpen={setOpen}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        value={value}
        setIsSelectCard={setIsSelectCard}
      />
    </StyledOuterBox>
  )
}

export default Stepper
