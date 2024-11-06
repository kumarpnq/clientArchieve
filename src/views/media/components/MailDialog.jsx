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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import useClientMailerList from 'src/api/global/useClientMailerList '

import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { generateTableHTML2 } from './emailFormat2'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedEndDate,
  selectSelectedStartDate
} from 'src/store/apps/user/userSlice'

import dayjs from 'dayjs'

const MailDialog = ({ open, setOpen, selectedCards, setSelectedCards, value, setIsSelectCard, setIsChecked }) => {
  //states
  const [emailType, setEmailType] = useState({})
  const [selectedEmails, setSelectedEmails] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [mailSubject, setMailSubject] = useState('')
  const [showHelperText, setShowHelperText] = useState(false)
  const [MailerFormat, setMailerFormat] = useState('dbWithoutDetails')
  const [sendMailLoading, setSendMailLoading] = useState(false)

  // * redux
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedCompaniesString = selectedCompetitions.join(', ')

  const formattedStartDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null
  const formattedEndDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

  const { mailList, subject } = useClientMailerList(open)

  useEffect(() => {
    setMailSubject(subject)
  }, [open])

  const onClose = () => {
    setOpen(false)
  }

  const generateWebURL = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      let url

      const params = {
        clientIds: clientId,
        companyIds: selectedCompaniesString,
        fromDate: formattedStartDate,
        toDate: formattedEndDate

        // mediaType: value
      }

      const response = await axios.get(`${BASE_URL}/encryptSocialMediaUrl`, {
        params,
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      const encryptedUrl = response.data.url
      url = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/SHARED-DASHBOARD/?id=${encryptedUrl}`

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

      const tableHtmlLink = generateTableHTML2(link, selectedClient?.clientName)
      sendEmail(tableHtmlLink)
    }
  }

  const sendEmail = async htmlContent => {
    try {
      setSendMailLoading(true)
      const recipients = selectedEmails.map(email => ({ id: email, recipientType: emailType[email] || 'to' }))
      const ccEmails = recipients.filter(i => i.recipientType === 'cc').map(i => i.id)
      const toEmails = recipients.filter(i => i.recipientType === 'to').map(i => i.id)
      const bccEmails = recipients.filter(i => i.recipientType === 'bcc').map(i => i.id)

      const requestData = {
        subject: mailSubject,
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
    } finally {
      setSendMailLoading(false)
    }
  }

  const handleChange = event => {
    setMailerFormat(event.target.value)
  }

  const handleEmailTypeChange = (event, email) => {
    setEmailType({
      ...emailType,
      [email]: event.target.value
    })
  }

  const handleCheckboxChange = email => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(selected => selected !== email))
    } else {
      setSelectedEmails([...selectedEmails, email])
    }
  }

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll)
    setSelectedEmails(selectAll ? [] : mailList)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color='primary'>Send Email</DialogTitle>

      <FormGroup style={{ marginLeft: '20px', marginRight: '20px' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              indeterminate={selectedEmails.length > 0 && selectedEmails.length < mailList.length}
            />
          }
          label='Select All'
        />
        {mailList?.map(email => (
          <div key={email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox checked={selectedEmails.includes(email)} onChange={() => handleCheckboxChange(email)} />
              }
              label={email}
            />

            <RadioGroup
              row
              value={emailType[email] || 'to'}
              onChange={e => handleEmailTypeChange(e, email)}
              style={{ marginLeft: '10px' }}
            >
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
            {/* <MenuItem value='dbWithDetails'>Mail without DB</MenuItem> */}
            <MenuItem value='dbWithoutDetails'>Mail with DB</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={onClose} color='primary' variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          variant='outlined'
          sx={{ backgroundColor: sendMailLoading ? '' : 'primary.main', color: 'text.primary' }}
          disabled={!selectedEmails.length}
        >
          {sendMailLoading && <CircularProgress size={'1em'} sx={{ mr: 1 }} />}
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MailDialog
