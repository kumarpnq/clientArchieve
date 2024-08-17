import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import React, { useState } from 'react'
import useClientMailerList from 'src/api/global/useClientMailerList '
import { generateTableHtml } from './emailFormat'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { generateTableHTML2 } from './emailFormat2'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedEndDate,
  selectSelectedStartDate,
  selectUserData
} from 'src/store/apps/user/userSlice'
import { formatDateTime } from 'src/utils/formatDateTime'
import dayjs from 'dayjs'

const MailDialog = ({ open, setOpen, selectedCards, setSelectedCards, value, setIsSelectCard, setIsChecked }) => {
  //states
  const [emailType, setEmailType] = useState({})
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)
  const [mailSubject, setMailSubject] = useState('')
  const [showHelperText, setShowHelperText] = useState(false)
  const [MailerFormat, setMailerFormat] = useState('')

  // * redux
  const selectedClient = useSelector(selectSelectedClient)
  const selectedUser = useSelector(selectUserData)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  const { mailList } = useClientMailerList(fetchEmailFlag)

  const onClose = () => {
    setOpen(false)
  }

  // * function to format date time to date only
  const formatDate = dateTimeString => {
    return dayjs(dateTimeString).format('YYYY-MM-DD')
  }

  const generateWebURL = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      let url

      const params = {
        clientIds: 'BMW23',
        fromDate: formatDate(formattedStartDate),
        toDate: formatDate(formattedEndDate),
        mediaType: value
      }

      const response = await axios.get(`${BASE_URL}/encryptSocialMediaUrl`, {
        params,
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      const encryptedUrl = response.data.url
      url = `http://localhost:3000/SHARED_DASHBOARD/id=${encryptedUrl}`

      return url
    } catch (error) {
      toast.error('Failed to generate URL.')
    }
  }

  const handleSendEmail = async () => {
    if (!mailSubject) {
      setShowHelperText(true)

      return
    }

    if (MailerFormat === 'dbWithoutDetails') {
      let link = await generateWebURL()
      if (!link) {
        return toast.error('Getting error')
      }

      const tableHtmlLink = generateTableHTML2(link, selectedUser.fullName)
      sendEmail(tableHtmlLink)
    } else {
      const tableHtml = generateTableHtml(selectedCards)
      sendEmail(tableHtml)
    }
  }

  const sendEmail = async htmlContent => {
    try {
      const toEmails = Object.keys(emailType).filter(email => emailType[email] === 'to')
      const ccEmails = Object.keys(emailType).filter(email => emailType[email] === 'cc')
      const bccEmails = Object.keys(emailType).filter(email => emailType[email] === 'bcc')

      const requestData = {
        subject: mailSubject,

        // emailAddresses: [
        //   'swapniltiwari47@hotmail.com',
        //   'siddeekshaikh97@gmail.com',
        //   'kumar@pnq.co.in',
        //   'tusharvispute07@gmail.com'
        // ],

        emailAddresses: toEmails,
        htmlTemplate: htmlContent,
        cc_email: ccEmails,
        bcc_email: bccEmails
      }
      const userToken = localStorage.getItem('accessToken')

      const response = await axios.post(`${BASE_URL}/sendPnQmail`, requestData, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      if (response) {
        toast.success('Email sent successfully!')
        setMailSubject('')
        setOpen(false)
        setSelectedCards([])
        setIsSelectCard(false)
      }
    } catch (error) {
      toast.error('Failed to send email: ' + error.message)
    }
  }

  const handleEmailTypeChange = (event, email) => {
    const selectedValue = event.target.value

    setEmailType(prevState => {
      const newEmailType = { ...prevState, [email]: selectedValue }
      if (selectedValue === 'none') {
        delete newEmailType[email]
      }

      return newEmailType
    })
  }

  const handleChange = event => {
    setMailerFormat(event.target.value)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color='primary'>Send Email</DialogTitle>

      <FormGroup style={{ marginLeft: '20px', marginRight: '20px' }}>
        {mailList?.map(email => (
          <div key={email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{email}</Typography>
            <RadioGroup
              row
              value={emailType[email] || 'none'}
              onChange={e => handleEmailTypeChange(e, email)}
              style={{ marginLeft: '10px' }}
            >
              <FormControlLabel value='none' control={<Radio />} label='None' />
              <FormControlLabel value='to' control={<Radio />} label='To' />
              <FormControlLabel value='cc' control={<Radio />} label='Cc' />
              <FormControlLabel value='bcc' control={<Radio />} label='Bcc' />
            </RadioGroup>
          </div>
        ))}
      </FormGroup>

      <TextField
        fullWidth
        placeholder='Email Subject'
        size='small'
        sx={{ px: 4 }}
        value={mailSubject}
        onChange={e => setMailSubject(e.target.value)}
        helperText={showHelperText ? <span style={{ color: 'red' }}>Please provide a subject for the email.</span> : ''}
      />
      <Divider sx={{ my: 1 }} />
      <DialogActions>
        <FormControl size='small' variant='outlined' sx={{ width: 200, mr: 2 }}>
          <InputLabel id='select-label'>Select Option</InputLabel>
          <Select labelId='select-label' value={MailerFormat} onChange={handleChange} label='Select Option'>
            <MenuItem value='dbWithDetails'>DB with Details</MenuItem>
            <MenuItem value='dbWithoutDetails'>DB without Detail</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={onClose} color='primary' variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          variant='outlined'
          sx={{ backgroundColor: 'primary.main', color: 'text.primary' }}
          disabled={Object.keys(emailType).length === 0}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MailDialog
