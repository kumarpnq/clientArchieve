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
import { getArticleFieldList } from '../../../../../api/print-headlines/dialog/ExcelDump/ExcelDumpDialogApi' // Adjust the import path accordingly
import useExcelDump from 'src/api/dump/useExcelDump'

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
import { formatDateTime } from 'src/utils/formatDateTime'

// ** third party import
import toast from 'react-hot-toast'

const ExcelDumpDialog = ({ open, handleClose, dataForExcelDump }) => {
  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompanyIds = useSelector(selectSelectedCompetitions)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const { responseData, loading, error, postData } = useExcelDump()

  // redux states
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)
  const articleIds = dataForExcelDump.length > 0 && dataForExcelDump.flatMap(item => item.articleId)

  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const entityType = 'printAndOnline'

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
      // If "Select All" is checked, select all fields
      setSelectedFields([...fields])
    } else {
      // If "Select All" is unchecked, clear selected fields
      setSelectedFields([])
    }
  }, [selectAll, fields])

  const handleCheckboxChange = fieldName => {
    // Toggle individual checkbox
    setSelectedFields(prevSelectedFields =>
      prevSelectedFields.includes(fieldName)
        ? prevSelectedFields.filter(field => field !== fieldName)
        : [...prevSelectedFields, fieldName]
    )

    // Uncheck "Select All" if any individual checkbox is unchecked
    setSelectAll(false)
  }

  const handleSelectAllChange = () => {
    // Toggle "Select All" checkbox
    setSelectAll(prevSelectAll => !prevSelectAll)

    // Clear selected fields when "Select All" is unchecked
    setSelectedFields([])
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
    const requestEntity = 'both'
    const page = dataForExcelDump.length && dataForExcelDump.map(i => i.page).join('')

    const articleIds = dataForExcelDump.length && dataForExcelDump.map(i => i.articleId).flat()
    const recordsPerPage = dataForExcelDump.length && dataForExcelDump.map(i => i.recordsPerPage).join('')
    const media =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.media)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const geography =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.geography)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const language = dataForExcelDump
      .find(item => item.language)
      ?.language.map(lang => lang.id)
      .join(',')

    // const languageIds = dataForExcelDump
    //   .find(item => item.language)
    //   ?.language.map(lang => lang.id)
    //   .join(',')
    // console.log('languageIds:', languageIds)

    const tags =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const headline =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.headline)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const body =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.headline)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const journalist =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.journalist)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const wordCombo =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.wordCombo)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const anyWord =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.anyWord)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const ignoreWords =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.ignoreWords)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const phrase =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.phrase)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const sortby =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.sortby)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const publicationCategory =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.publicationCategory)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const editionType =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.editionType?.editionTypeId)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const searchCriteria = {
      selectPageOrAll,
      requestEntity,
      ...(selectPageOrAll !== 'A' && { page }),
      ...(selectPageOrAll !== 'A' && { recordsPerPage }),
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
    // const searchCriteria = {}
    // dataForExcelDump.forEach(item => {
    //   const [key] = Object.keys(item)
    //   const value = item[key]
    //   searchCriteria[key] = value
    // })
    searchCriteria.fromDate = formattedStartDate
    searchCriteria.toDate = formattedEndDate
    // searchCriteria.selectedCompanyIds = selectedCompanyIds

    // Remove articleIds from searchCriteria
    // delete searchCriteria.articleId

    const postDataParams = {
      clientId,
      selectedFields,
      notificationFlag
    }

    if (
      (media === '' &&
        geography === '' &&
        language === '' &&
        tags === '' &&
        [media, geography, language, tags].some(field => field.includes('articleId'))) ||
      (articleIds.length && articleIds.some(id => id !== undefined))
    ) {
      postDataParams.articleIds = articleIds.filter(id => id !== undefined)
    } else {
      postDataParams.searchCriteria = searchCriteria
    }

    postData(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setSelectedFields([])
    setSelectAll(false)
    if (error) return toast.error('something wrong.')
    if (responseData?.message) {
      responseData.message && toast.success(responseData.message)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs'>
      <DialogTitle color='primary'>Excel Dump</DialogTitle>
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
                  <Checkbox checked={selectedFields.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                }
                label={item.name}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
        <Button onClick={handleDownload} color='primary' disabled={selectedFields.length === 0}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExcelDumpDialog
