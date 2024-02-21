import React, { useState } from 'react'
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

// ** Date picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const DossierDialog = ({ open, handleClose, selectedStartDate, selectedEndDate }) => {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [subject, setSubject] = useState('')
  const [dossierType, setDossierType] = useState('word') // Default to Word Dossier
  const [selectedEmail, setSelectedEmail] = useState('') // Selected email from dropdown
  const selectedClient = useSelector(selectSelectedClient)
  const clientName = selectedClient ? selectedClient.clientName : null
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handleCompanyNameChange = event => {
    setCompanyName(event.target.value)
  }

  const handleSubjectChange = event => {
    setSubject(event.target.value)
  }

  const handleFromDateChange = event => {
    setFromDate(event.target.value)
  }

  const handleToDateChange = event => {
    setToDate(event.target.value)
  }

  const handleDossierTypeChange = event => {
    setDossierType(event.target.value)
  }

  const handleSelectedEmailChange = event => {
    setSelectedEmail(event.target.value)
  }

  const handleSubmit = () => {
    // Add your logic to handle form submission
    console.log('Email:', email)
    console.log('Company Name:', companyName)
    console.log('Subject:', subject)
    console.log('Form Data To Date:', formDataToDate)
    console.log('Dossier Type:', dossierType)
    console.log('Selected Email:', selectedEmail)

    // Display a message to the user
    alert('After submitting the request, the system will send a Dossier link to the selected E-Mail IDs.')

    // Close the dialog
    handleClose()
  }

  const emailIds = ['dummy1@example.com', 'dummy2@example.com', 'dummy3@example.com']

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Dossier</DialogTitle>
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
            <TextField
              fullWidth
              select
              label='Select Email ID'
              value={selectedEmail}
              onChange={handleSelectedEmailChange}
              margin='normal'
            >
              {emailIds.map((emailId, index) => (
                <MenuItem key={index} value={emailId}>
                  {emailId}
                </MenuItem>
              ))}
            </TextField>
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
