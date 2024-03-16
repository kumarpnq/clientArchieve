import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import WarningIcon from '@mui/icons-material/Warning'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'

// ** Date picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

// ** Redux
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSelectedClient,
  setNotificationFlag,
  selectNotificationFlag,
  setFetchAutoStatusFlag,
  selectFetchAutoStatusFlag
} from 'src/store/apps/user/userSlice'
import useDossierRequest from 'src/api/print-headlines/Dossier/useDossierRequest'

// import useClientMailerList from 'src/api/global/useClientMailerList '
import { BASE_URL } from 'src/api/base'

// ** third party imports
import toast from 'react-hot-toast'

const DossierDialog = ({ open, handleClose, selectedStartDate, selectedEndDate, dataForDossierDownload }) => {
  //redux state
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const clientName = selectedClient ? selectedClient.clientName : null

  // hooks import
  // const { mailList } = useClientMailerList()
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [subject, setSubject] = useState('')
  const [dossierType, setDossierType] = useState('word') // Default to Word Dossier
  const [selectedEmail, setSelectedEmail] = useState([]) // Selected email from dropdown
  const [mailList, setMailList] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const { response, error, sendDossierRequest } = useDossierRequest()
  const articleIds = dataForDossierDownload.length > 0 && dataForDossierDownload.flatMap(item => item.articleId)
  const selectPageOrAll = dataForDossierDownload.length && dataForDossierDownload.map(i => i.selectPageorAll).join()

  // redux states
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)

  const handleEmailChange = event => {
    const { value } = event.target
    setEmail(value)
    setSelectedEmail(prev => [...prev, value])
  }

  const handleCompanyNameChange = event => {
    setCompanyName(event.target.value)
  }

  const handleSubjectChange = event => {
    setSubject(event.target.value)
  }

  const handleDossierTypeChange = event => {
    setDossierType(event.target.value)
  }

  const handleSelectedEmailChange = event => {
    setSelectedEmail(event.target.value)
  }

  const handleSubmit = () => {
    dispatch(setNotificationFlag(!notificationFlag))
    const searchCriteria = { fromDate, toDate, selectPageOrAll }
    const recipients = { recipients: selectedEmail || email }
    sendDossierRequest(clientId, articleIds, dossierType, recipients, searchCriteria)

    // Close the dialog
    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setEmail('')
    setSelectedEmail([])
    if (error) {
      toast.error('something wrong')
    } else {
      toast.success(response?.message ?? 'Success!')
    }
  }
  useEffect(() => {
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
        setMailList(axiosResponse.data.emails)
      } catch (axiosError) {
        console.log(axiosError)
      }
    }

    getClientMailerList()
  }, [clientId])

  if (!dataForDossierDownload || dataForDossierDownload.length === 0) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <WarningIcon style={{ marginRight: '8px' }} />
          Please Select At Least One Article
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ textAlign: 'center', marginBottom: '16px' }}>
            To generate an Dossier Download, you must select at least one article.
          </DialogContentText>
          <Box display='flex' justifyContent='center'>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle color='primary'>Dossier</DialogTitle>
      <DialogContent>
        {/* Dossier Type Radio Buttons */}
        <FormControl component='fieldset' fullWidth>
          <FormLabel component='legend'>Select Dossier Type</FormLabel>
          <RadioGroup
            row
            aria-label='dossier-type'
            name='dossier-type'
            value={dossierType}
            onChange={handleDossierTypeChange}
          >
            <FormControlLabel value='word' control={<Radio />} label='Word Dossier' />
            <FormControlLabel value='pdf' control={<Radio />} label='PDF Dossier' />
          </RadioGroup>
        </FormControl>
        {/* Email ID Dropdown and Text Field in the same line */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Email Dropdown */}
            <FormControl fullWidth margin='normal'>
              <InputLabel id='demo-simple-select-label'>Emails</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={selectedEmail}
                label='Age'
                multiple
                onChange={handleSelectedEmailChange}
              >
                {mailList.map(emailId => (
                  <MenuItem key={emailId} value={emailId}>
                    {emailId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {/* Email Text Field */}
            <TextField fullWidth label='Enter Email' value={email} onChange={handleEmailChange} margin='normal' />
          </Grid>
        </Grid>
        {/* Other Text Fields */}
        <TextField
          fullWidth
          label='Enter Client/Company Name'
          value={clientName}
          onChange={handleCompanyNameChange}
          margin='normal'
        />
        <TextField
          fullWidth
          label='Enter Title/Subject'
          value={subject}
          onChange={handleSubjectChange}
          margin='normal'
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ marginTop: '8px' }}>
            <Grid item xs={6}>
              <DatePicker
                label='Start Date'
                value={selectedStartDate}
                onChange={date => setFromDate(date)}
                renderInput={params => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label='End Date'
                value={selectedEndDate}
                onChange={date => setToDate(date)}
                renderInput={params => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        {/* Message for the user */}
        <p style={{ margin: '16px 0', color: '#757575' }}>
          After submitting the request, the system will send a Dossier link to the selected E-Mail IDs.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary'>
          Submit Your Request
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DossierDialog
