// ExcelDumpDialog.js
import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import WarningIcon from '@mui/icons-material/Warning'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** third party imports
import toast from 'react-hot-toast'

// ** Redux
import { useSelector, useDispatch } from 'react-redux' // Import useSelector from react-redux
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  setNotificationFlag,
  selectNotificationFlag,
  selectSelectedStartDate,
  selectSelectedEndDate,
  setFetchAutoStatusFlag,
  selectFetchAutoStatusFlag
} from 'src/store/apps/user/userSlice'
import { getArticleFieldList } from 'src/api/print-headlines/dialog/ExcelDump/ExcelDumpDialogApi'
import useExcelDump from 'src/api/dump/useExcelDump'
import { Box, DialogContentText } from '@mui/material'
import dayjs from 'dayjs'

const ExcelDumpDialog = ({ open, handleClose, dataForExcelDump, pageCheck, allCheck }) => {
  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompanyIds = useSelector(selectSelectedCompetitions)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)
  const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null

  const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

  // states
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const { responseData, loading, error, postData } = useExcelDump('online')
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)

  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const entityType = 'online'
        if (storedToken) {
          const fields = await getArticleFieldList(storedToken, entityType)
          setFields(fields)
        }
      } catch (error) {
        console.error('Error fetching field list:', error)
      }
    }

    fetchFieldList()
  }, [])

  useEffect(() => {
    if (selectAll) {
      setSelectedFields([...fields.map(field => field.name)])
    } else {
      setSelectedFields([])
    }
  }, [selectAll, fields])

  const handleCheckboxChange = fieldId => {
    setSelectedFields(prevSelectedFields =>
      prevSelectedFields.includes(fieldId)
        ? prevSelectedFields.filter(field => field !== fieldId)
        : [...prevSelectedFields, fieldId]
    )

    setSelectAll(false)
  }

  const handleSelectAllChange = () => {
    setSelectAll(prevSelectAll => !prevSelectAll)
  }

  const handleDownload = () => {
    dispatch(setNotificationFlag(!notificationFlag))
    function convertPageOrAll(value) {
      if (typeof value === 'number') {
        return value === 0 ? 'A' : 'P'
      }

      return value
    }

    const selectPageOrAll =
      dataForExcelDump.length && dataForExcelDump.map(i => convertPageOrAll(i.selectPageorAll)).join('')
    const requestEntity = 'online'

    const page = dataForExcelDump.length && dataForExcelDump.map(i => i.page).join('')

    const articleIds = dataForExcelDump.map(i => i?.articleId).filter(id => id !== undefined)

    const recordsPerPage = dataForExcelDump.length && dataForExcelDump.map(i => i.recordsPerPage).join('')

    const media =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.media)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const geography =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.geography)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const language =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.language)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const tags =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const headline =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.headline)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const body =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.headline)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const journalist =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.journalist)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const wordCombo =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.wordCombo)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const anyWord =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.anyWord)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const ignoreWords =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.ignoreWords)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const phrase =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.phrase)
        .flat()
        .join('')
        .replace(/,+$/, '')

    const sortby = (dataForExcelDump.find(obj => obj.sortby) || {}).sortby

    const publicationCategory =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.publicationCategory)
        .flat()
        .join(',')
        .replace(/^,+/g, '')
        .replace(/,+/g, ',')
        .replace(/,+$/, '')

    const editionType =
      dataForExcelDump.length &&
      dataForExcelDump
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
      clientId,
      selectedFields,
      notificationFlag
    }

    if (pageCheck === true || allCheck === true) {
      postDataParams.searchCriteria = searchCriteria
    } else {
      const flattenIds = articleIds.flatMap(i => i)
      const articleIdsWithType = flattenIds.map(i => ({ id: Number(i), type: 'o' }))

      postDataParams.articleIdsWithType = articleIdsWithType
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

    postData(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setSelectedFields([])
    setSelectAll(false)
    if (responseData) {
      toast.success('Excel dump taken successfully.')
    }
  }

  if (!dataForExcelDump || dataForExcelDump.length === 0) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <WarningIcon style={{ marginRight: '8px' }} />
          Please Select At Least One Article
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To perform the excel dump operation, you must select at least one article.
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
    <Dialog open={open} onClose={handleClose} maxWidth='sm'>
      <DialogTitle color='primary'>Excel Dump</DialogTitle>
      <PerfectScrollbarComponent>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
            label='Select All'
          />
          <Grid container spacing={1}>
            {fields.map(item => (
              <Grid item xs={6} key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.includes(item.name)}
                      onChange={() => handleCheckboxChange(item.name)}
                    />
                  }
                  label={item.name}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </PerfectScrollbarComponent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' variant='outlined'>
          Close
        </Button>
        <Button
          onClick={handleDownload}
          sx={{ backgroundColor: 'primary.main', color: 'text.primary' }}
          disabled={selectedFields.length === 0}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExcelDumpDialog
