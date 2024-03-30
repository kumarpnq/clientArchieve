import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormGroup from '@mui/material/FormGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import WarningIcon from '@mui/icons-material/Warning'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'

// ** hooks import
import useClientMailerList from 'src/api/global/useClientMailerList '
import useMailRequest from 'src/api/print-headlines/mail/useMailRequest'

// ** redux imports
import { useSelector, useDispatch } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedStartDate,
  selectSelectedEndDate,
  setFetchAutoStatusFlag,
  setNotificationFlag,
  selectNotificationFlag,
  selectFetchAutoStatusFlag
} from 'src/store/apps/user/userSlice'

//* third party imports
import toast from 'react-hot-toast'
import { formatDateTime } from 'src/utils/formatDateTime'

const EmailDialog = ({ open, onClose, dataForMail }) => {
  //redux state
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)
  const dispatch = useDispatch()

  // state
  const [emailType, setEmailType] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState([])
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)

  // customs
  const articleIds = dataForMail.length && dataForMail.map(i => i.articleId).flat()
  const pageLimit = dataForMail.length && dataForMail.map(i => i.pageLimit).join('')
  const { mailList } = useClientMailerList(fetchEmailFlag)
  const { response, error, sendMailRequest } = useMailRequest()

  const selectPageOrAll = dataForMail.length && dataForMail.map(i => i.selectPageorAll).join('')

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

  const handleSendEmail = () => {
    setFetchEmailFlag(!fetchEmailFlag)
    dispatch(setNotificationFlag(!notificationFlag))

    const recipients = selectedEmails.map(email => ({ email, sendType: emailType[email] || 'To' }))

    function convertPageOrAll(value) {
      if (typeof value === 'number') {
        return value === 0 ? 'A' : 'P'
      }
      return value
    }

    const selectPageOrAll = dataForMail.length && dataForMail.map(i => convertPageOrAll(i.selectPageorAll)).join('')
    const requestEntity = 'online'
    const page = dataForMail.length && dataForMail.map(i => i.page).join('')

    const articleIds =
      dataForMail.length && dataForMail?.flatMap(i => i?.articleId?.map(id => ({ id, type: 'online' })))
    const recordsPerPage = dataForMail.length && dataForMail.map(i => i.recordsPerPage).join('')
    const media =
      dataForMail.length &&
      dataForMail
        .map(i => i.media)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const geography =
      dataForMail.length &&
      dataForMail
        .map(i => i.geography)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const language =
      dataForMail.length &&
      dataForMail
        .map(i => i.language)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const tags =
      dataForMail.length &&
      dataForMail
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const formattedFromDate = formatDateTime(selectedFromDate)
    const formattedToDate = formatDateTime(selectedEndDate)

    const searchCriteria = {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      selectPageOrAll,
      page,
      requestEntity,
      recordsPerPage
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
      recipients,
      clientId,
      notificationFlag
      // notificationFlag
    }

    if (
      media === '' &&
      geography === '' &&
      language === '' &&
      tags === '' &&
      articleIds.length &&
      articleIds.some(id => id !== undefined)
    ) {
      postDataParams.articleIds = articleIds.filter(id => id !== undefined)
    } else {
      postDataParams.searchCriteria = searchCriteria
    }
    sendMailRequest(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    onClose()
    if (error) {
      toast.error('something wrong.')
    } else {
      toast.success(response?.message || 'success')
    }
  }

  const handleAllDropdownChange = value => {
    if (value === 'all') {
      setSelectedEmails([...mailList])
    } else if (value === 'none') {
      setSelectedEmails([])
    }
  }

  if (!dataForMail || dataForMail.length === 0) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <WarningIcon style={{ marginRight: '8px' }} />
          Please Select At Least One Article
        </DialogTitle>
        <DialogContentText>
          <DialogContentText style={{ textAlign: 'center', marginBottom: '16px' }}>
            To generate an Mail Download, you must select at least one article.
          </DialogContentText>
          <Box display='flex' justifyContent='center'>
            <Button onClick={onClose} color='primary'>
              Close
            </Button>
          </Box>
        </DialogContentText>
      </Dialog>
    )
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

        {mailList.map(email => (
          <div key={email} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox checked={selectedEmails.includes(email)} onChange={() => handleCheckboxChange(email)} />
              }
              label={email}
            />
            <RadioGroup
              row
              value={emailType[email]}
              onChange={e => handleEmailTypeChange(e, email)}
              style={{ marginLeft: '10px' }}
            >
              <FormControlLabel value='To' control={<Radio />} label='To' />
              <FormControlLabel value='Cc' control={<Radio />} label='Cc' />
              <FormControlLabel value='Bcc' control={<Radio />} label='Bcc' />
            </RadioGroup>
          </div>
        ))}
      </FormGroup>

      <DialogActions>
        <Select value='' displayEmpty onChange={e => handleAllDropdownChange(e.target.value)}>
          <MenuItem value='' disabled>
            All
          </MenuItem>
          <MenuItem value='all'>Select All</MenuItem>
          <MenuItem value='none'>Select None</MenuItem>
        </Select>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSendEmail} color='primary' disabled={!selectedEmails.length}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailDialog
