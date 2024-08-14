import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import useClientMailerList from 'src/api/global/useClientMailerList '
import { generateTableHtml } from './emailFormat'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const MailDialog = ({ open, setOpen, selectedCards, setSelectedCards }) => {
  //states
  const [emailType, setEmailType] = useState({})
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)
  const [mailSubject, setMailSubject] = useState('')
  const [showHelperText, setShowHelperText] = useState(false)

  const { mailList } = useClientMailerList(fetchEmailFlag)

  const onClose = () => {
    setOpen(false)
  }

  const handleSendEmail = () => {
    if (!mailSubject) {
      setShowHelperText(true)

      return
    }

    const tableHtml = generateTableHtml(selectedCards)
    sendEmail(tableHtml)
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

      alert('Email sent successfully!')
    } catch (error) {
      alert('Failed to send email: ' + error.message)
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
