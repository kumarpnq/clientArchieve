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
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import useClientMailerList from 'src/api/global/useClientMailerList '
import useMailRequest from 'src/api/print-headlines/mail/useMailRequest'

import { useSelector, useDispatch } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedStartDate,
  selectSelectedEndDate,
  setNotificationFlag,
  selectNotificationFlag,
  setFetchAutoStatusFlag,
  selectFetchAutoStatusFlag,
  selectSelectedCompetitions
} from 'src/store/apps/user/userSlice'

import toast from 'react-hot-toast'

import dayjs from 'dayjs'
import useIsMailTemplate from 'src/api/mail/useIsMailTemplateAvailable'

const EmailDialog = ({ open, onClose, dataForMailDump, pageCheck, allCheck }) => {
  const [emailType, setEmailType] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState([])
  const [fetchEmailFlag, setFetchEmailFlag] = useState(false)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedCompanyIds = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)

  const { isTemplate, checkMailTemplate } = useIsMailTemplate()
  const { mailList } = useClientMailerList(fetchEmailFlag)
  const { response, error, sendMailRequest } = useMailRequest('both')
  const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null
  const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

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

  const handleSendEmail = async () => {
    // const templateResponse = await checkMailTemplate('both')

    // if (!templateResponse) {
    //   toast.error('Mailer format not configured for this client.')
    //   onClose()

    //   return
    // }
    setFetchEmailFlag(!fetchEmailFlag)
    dispatch(setNotificationFlag(!notificationFlag))
    const recipients = selectedEmails.map(email => ({ id: email, recipientType: emailType[email] || 'to' }))

    function convertPageOrAll(value) {
      if (typeof value === 'number') {
        return value === 0 ? 'A' : 'P'
      }

      return value
    }

    const selectPageOrAll =
      dataForMailDump.length && dataForMailDump.map(i => convertPageOrAll(i.selectPageorAll)).join('')
    const requestEntity = 'both'
    const page = dataForMailDump.length && dataForMailDump.map(i => i.page).join('')

    const articleIds =
      dataForMailDump.length &&
      dataForMailDump?.flatMap(i =>
        i?.articleId?.map(id => ({ id: Number(id.articleId), type: id.articleType === 'print' ? 'p' : 'o' }))
      )

    const recordsPerPage = dataForMailDump.length && dataForMailDump.map(i => i.recordsPerPage).join('')

    const media =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.media)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const geography =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.geography)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const language =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.language)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const tags =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const headline =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.headline)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const body =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.body)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const journalist =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.journalist)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const wordCombo =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.wordCombo)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const anyWord =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.anyWord)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const ignoreWords =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.ignoreWords)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const phrase =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.phrase)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const sortby = (dataForMailDump.find(obj => obj.sortby) || {}).sortby

    const publicationCategory =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.publicationCategory)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const editionType =
      dataForMailDump.length &&
      dataForMailDump
        .map(i => i.editionType)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const searchCriteria = {
      selectPageOrAll,
      requestEntity,
      ...(selectPageOrAll !== 'A' && { page: Number(page) }),
      ...(selectPageOrAll !== 'A' && { recordsPerPage: Number(recordsPerPage) }),
      clientIds: clientId,
      companyIds: selectedCompanyIds.join(',')
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

    searchCriteria.fromDate = formattedFromDate

    searchCriteria.toDate = formattedToDate

    const postDataParams = {
      recipients,
      clientId,
      notificationFlag
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

    sendMailRequest(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    onClose()

    toast.success('Email request taken successfully.', { duration: 3000 })
  }

  const handleAllDropdownChange = value => {
    if (value === 'all') {
      setSelectedEmails([...mailList])
    } else if (value === 'none') {
      setSelectedEmails([])
    }
  }

  if (!dataForMailDump || dataForMailDump.length === 0) {
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
      <DialogTitle>Send Email</DialogTitle>
      <PerfectScrollbarComponent>
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
      </PerfectScrollbarComponent>
      <DialogActions>
        {/* <Select value='' displayEmpty onChange={e => handleAllDropdownChange(e.target.value)}>
          <MenuItem value='' disabled>
            All
          </MenuItem>
          <MenuItem value='all'>Select All</MenuItem>
          <MenuItem value='none'>Select None</MenuItem>
        </Select> */}
        <Button onClick={onClose} color='primary' variant='outlined'>
          Cancel
        </Button>
        <Button onClick={handleSendEmail} sx={{ color: 'text.primary', backgroundColor: 'primary.main' }}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailDialog
