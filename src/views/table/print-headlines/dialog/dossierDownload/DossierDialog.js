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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSelectedClient,
  setNotificationFlag,
  selectNotificationFlag,
  setFetchAutoStatusFlag,
  selectFetchAutoStatusFlag
} from 'src/store/apps/user/userSlice'
import useDossierRequest from 'src/api/print-headlines/Dossier/useDossierRequest'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import useClientMailerList from 'src/api/global/useClientMailerList '

const DossierDialog = ({
  open,
  handleClose,
  selectedStartDate,
  selectedEndDate,
  dataForDossierDownload,
  pageCheck,
  allCheck
}) => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const clientName = selectedClient ? selectedClient.clientName : null

  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [subject, setSubject] = useState('')
  const [dossierType, setDossierType] = useState('word')
  const [selectedEmail, setSelectedEmail] = useState([])
  const [mailList, setMailList] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const { response, error, sendDossierRequest } = useDossierRequest()
  const articleIds = dataForDossierDownload.length > 0 && dataForDossierDownload.flatMap(item => item.articleId)
  const selectPageOrAll = dataForDossierDownload.length && dataForDossierDownload.map(i => i.selectPageorAll).join('')
  const pageLimit = dataForDossierDownload.length && dataForDossierDownload.map(i => i.pageLimit).join('')
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)
  const { mailList: mailerList, subject: mailerSubject } = useClientMailerList()
  const formattedStartDateTest = selectedStartDate ? dayjs(selectedStartDate).format('YYYY-MM-DD') : null
  const formattedEndDateTest = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD') : null

  useEffect(() => {
    setMailList(mailerList)
    setSubject('')
  }, [open])

  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)

  const handleEmailChange = event => {
    const { value } = event.target
    setEmail(value)
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

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(setNotificationFlag(!notificationFlag))

    let recipients = []

    const recipientsFromDropdown = selectedEmail.map(emailId => ({ id: emailId, recipientType: 'to' }))
    if (email.trim() !== '') {
      const recipientsFromManualInput = email.split(',').map(emailId => ({ id: emailId.trim(), recipientType: 'to' }))
      recipients = [...recipientsFromDropdown, ...recipientsFromManualInput]
    } else {
      recipients = [...recipientsFromDropdown]
    }

    function convertPageOrAll(value) {
      if (typeof value === 'number') {
        return value === 0 ? 'A' : 'P'
      }

      return value
    }

    const selectPageOrAll =
      dataForDossierDownload.length && dataForDossierDownload.map(i => convertPageOrAll(i.selectPageorAll)).join('')
    const requestEntity = 'print'
    const page = dataForDossierDownload.length && dataForDossierDownload.map(i => i.page).join('')

    const articleIds =
      dataForDossierDownload.length &&
      dataForDossierDownload?.flatMap(i => i?.articleId?.map(id => ({ id, type: 'p' })))
    const recordsPerPage = dataForDossierDownload.length && dataForDossierDownload.map(i => i.recordsPerPage).join('')

    const media =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.media)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const geography =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.geography)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const language =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.language)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const tags =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const headline =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.headline)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const body =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.body)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const journalist =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.journalist)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const wordCombo =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.wordCombo)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const anyWord =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.anyWord)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const ignoreWords =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.ignoreWords)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const phrase =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.phrase)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const sortby =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.sortby)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const publicationCategory =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.publicationCategory)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const editionType =
      dataForDossierDownload.length &&
      dataForDossierDownload
        .map(i => i.editionType)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const searchCriteria = {
      fromDate: formattedStartDateTest,
      toDate: formattedEndDateTest,
      selectPageOrAll,
      ...(selectPageOrAll !== 'A' && { page }),
      ...(selectPageOrAll !== 'A' && { recordsPerPage }),
      requestEntity,
      clientIds: clientId
    }

    if (editionType !== '') {
      searchCriteria.editionType = editionType
    }

    if (publicationCategory !== '') {
      searchCriteria.publicationCategory = publicationCategory
    }

    if (sortby !== '') {
      searchCriteria.sortby = sortby
    }

    if (body !== '') {
      searchCriteria.body = body
    }

    if (journalist !== '') {
      searchCriteria.journalist = journalist
    }

    if (wordCombo !== '') {
      searchCriteria.wordCombo = wordCombo
    }

    if (anyWord !== '') {
      searchCriteria.anyWord = anyWord
    }

    if (ignoreWords !== '') {
      searchCriteria.ignoreWords = ignoreWords
    }

    if (phrase !== '') {
      searchCriteria.phrase = phrase
    }

    if (headline !== '') {
      searchCriteria.headline = headline
    }

    if (media !== '') {
      searchCriteria.media = media
    }

    if (geography !== '') {
      searchCriteria.geography = geography
    }

    if (language != '') {
      searchCriteria.language = language
    }

    if (tags != '') {
      searchCriteria.tags = tags
    }

    const postDataParams = {
      notificationFlag,
      recipients,
      subject,
      clientId,
      clientName,
      dossierType,
      requestEntity: 'print'

      // notificationFlag
    }

    if (pageCheck === true || allCheck === true) {
      postDataParams.searchCriteria = searchCriteria
    } else {
      postDataParams.articleIds = articleIds.filter(id => id !== undefined)
    }

    if (
      (media === '' &&
        geography === '' &&
        language === '' &&
        tags === '' &&
        [media, geography, language, tags].some(field => field.includes('articleId'))) ||
      (articleIds.length && articleIds.some(id => id !== undefined))
    ) {
    } else {
      postDataParams.searchCriteria = searchCriteria
    }

    sendDossierRequest(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setEmail('')
    setSelectedEmail([])

    toast.success('Dossier request taken successfully.')
  }

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
            s
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
      <form onSubmit={handleSubmit}>
        <DialogContent>
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
                  {mailList?.map(emailId => (
                    <MenuItem key={emailId} value={emailId}>
                      {emailId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label='Enter Email' value={email} onChange={handleEmailChange} margin='normal' />
            </Grid>
          </Grid>
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
            required
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
          <p style={{ margin: '16px 0', color: '#757575' }}>
            After submitting the request, the system will send a Dossier link to the selected E-Mail IDs.
          </p>
        </DialogContent>
        <div inert={open ? true : undefined}>
          <DialogActions>
            <Button onClick={handleClose} color='primary' variant='outlined'>
              Cancel
            </Button>
            <Button sx={{ backgroundColor: 'primary.main', color: 'text.primary' }} type='submit'>
              Submit
            </Button>
          </DialogActions>
        </div>
      </form>
    </Dialog>
  )
}

export default DossierDialog
