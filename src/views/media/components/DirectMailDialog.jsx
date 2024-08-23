import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import toast from 'react-hot-toast'
import useClientMailerList from 'src/api/global/useClientMailerList '
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { useSelector } from 'react-redux'

const DirectMailDialog = ({ open, setOpen, link, setLink }) => {
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)
  const [emailList, setEmailList] = useState([])
  const [subject, setSubject] = useState('')
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const getClientMailerList = async () => {
    const storedToken = localStorage.getItem('accessToken')
    try {
      const url = `${BASE_URL}/clientMailerList/`

      const headers = {
        Authorization: `Bearer ${storedToken}`
      }

      const requestData = {
        clientId
      }

      const axiosConfig = {
        headers,
        params: requestData
      }

      const axiosResponse = await axios.get(url, axiosConfig)

      setSubject(axiosResponse.data.emails.subject || '')
      setEmailList(axiosResponse.data.emails.mailList || [])
    } catch (axiosError) {
      setError(axiosError)
    }
  }

  useEffect(() => {
    if (open && emailList.length === 0) {
      getClientMailerList()
    }
  }, [open, clientId])

  const getArticleActivities = (mediaType, item) => {
    switch (mediaType) {
      case 'youtube':
        return `Views : ${item?.stats?.viewCount} | Likes : ${item?.stats?.likeCount || 0} | Comments : ${
          item?.stats?.commentCount
        } | Favorite : ${item?.stats?.favoriteCount}`
      case 'twitter':
        return `Followers : ${item?.stats?.followersCount} | Likes : ${item?.stats?.likeCount} | Retweets : ${item?.stats?.retweet_count} | Replies : ${item?.stats?.reply_count} | Impressions : ${item?.stats?.impression_count}`
      case 'facebook':
        return `Reactions : ${item?.stats?.reactionCount}`
      default:
        return ''
    }
  }
  const mediaType = link?.mediaType
  const activities = getArticleActivities(mediaType, link)

  const [mailData, setMailData] = useState({
    subject: "P&Q NEWSLETTER THE DAY'S MOST PROMINENT NEWS",
    mailId: '',
    mailBody: `${link?.title}\n ${activities}\n ${link?.link}`
  })

  useEffect(() => {
    setMailData(prevData => ({
      ...prevData,
      mailBody: `${link?.title}\n ${activities}\n ${link?.link}`,
      subject: subject
    }))
  }, [link, open, subject])

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
    const parts = mailData?.mailBody?.split('\n')
    const title = parts[0]
    const stats = parts[1]
    const linkSend = parts[2]
    const additionalContent = parts.slice(3).join('\n') || ''

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
        p{
        font-size:smaller;
      }
        h3{
        font-size:smaller;
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
        <h3>${title}</h3>
        <p>${stats}</p>
        <p>${additionalContent}</p>
        <h3>${linkSend}</h3>
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
            rows={6}
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
