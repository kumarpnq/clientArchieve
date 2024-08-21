import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import toast from 'react-hot-toast'

const DirectMailDialog = ({ open, setOpen, link, setLink }) => {
  const [mailData, setMailData] = useState({
    subject: "P&Q NEWSLETTER THE DAY'S MOST PROMINENT NEWS",
    mailId: '',
    mailBody: ''
  })

  useEffect(() => {
    setMailData(prevData => ({
      ...prevData,
      mailBody: link
    }))
  }, [link])

  const handleChange = e => {
    const { name, value } = e.target
    setMailData({
      ...mailData,
      [name]: value
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const htmlTemplate = `
   <html>
   <head>
   <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        background-color: #ccc7c7;
        padding: 20px;
        text-align: center;
      }
      .header-logo {
        color: #222;
        font-weight: bold;
        text-align: center;
        font-size: 18px; /* Reduced font size */
      }
      .header-logo .and {
        color: red;
      }
      .report-link {
        text-align: center;
        font-size: 14px;
        color: #595959;
        margin-top: 10px;
      }
      .report-link a {
        color: #595959;
        text-decoration: none;
      }
      .report-link a:hover {
        text-decoration: underline;
      }
      .title {
        background-color: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #595959;
      }
      .footer a {
        color: #595959;
        text-decoration: none;
        margin: 0 10px;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .footer-copy {
        font-size: 12px;
        color: #aaa;
        margin-top: 10px;
      }
   </style>
   </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-logo">PERCEPTION <span class="and">&</span> <span>QUANT</span></div>
      </div>
      <div class="title">
        ${mailData.mailBody}
      </div>
      <div class="footer">
        <a href="https://www.cirrus.co.in/">Help center</a> |
        <a href="mailto:newsalert@cirrus.co.in">Customer support</a>
        <div class="footer-copy">
          © Copyright 2024 PERCEPTION & QUANT – All rights reserved.
        </div>
      </div>
    </div>
  </body>
  </html>
  `

    const requestData = {
      subject: mailData.subject,
      emailAddresses: [mailData.mailId],
      htmlTemplate: htmlTemplate,
      cc_email: '',
      bcc_email: ''
    }

    const userToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${BASE_URL}/sendPnQmail`, requestData, {
        headers: { Authorization: `Bearer ${userToken}` }
      })

      toast.success('Email sent successfully:')
      handleClose()
    } catch (error) {
      toast.error('Error sending email')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Send Direct Mail</DialogTitle>
        <DialogContent>
          <TextField
            label='Subject'
            name='subject'
            fullWidth
            margin='dense'
            size='small'
            required
            value={mailData.subject}
            onChange={handleChange}
          />
          <TextField
            label='Mail ID'
            name='mailId'
            fullWidth
            margin='dense'
            size='small'
            type='email'
            required
            value={mailData.mailId}
            onChange={handleChange}
          />
          <TextField
            label='Mail Body'
            name='mailBody'
            fullWidth
            margin='dense'
            multiline
            required
            rows={4}
            value={mailData.mailBody || link}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' variant='outlined'>
            Cancel
          </Button>
          <Button type='submit' color='primary' variant='contained'>
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DirectMailDialog
