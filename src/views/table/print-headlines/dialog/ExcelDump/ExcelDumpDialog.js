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
import WarningIcon from '@mui/icons-material/Warning'

// ** third party import
import toast from 'react-hot-toast'
import { Box, DialogContentText } from '@mui/material'

const ExcelDumpDialog = ({
  open,
  handleClose,
  dataForExcelDump,
  selectedArticles,
  pageCheck,
  allCheck,
  setSelectedArticles
}) => {
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
  const { responseData, loading, error, postData } = useExcelDump('print')

  // redux states
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)
  const articleIds = dataForExcelDump.length > 0 && dataForExcelDump.flatMap(item => item.articleId)

  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const entityType = 'print'

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

  const handleCheckboxChange = fieldName => {
    setSelectedFields(prevSelectedFields =>
      prevSelectedFields.includes(fieldName)
        ? prevSelectedFields.filter(field => field !== fieldName)
        : [...prevSelectedFields, fieldName]
    )

    setSelectAll(false)
  }

  const handleSelectAllChange = () => {
    setSelectAll(prevSelectAll => !prevSelectAll)
  }

  // const handleDownload = () => {
  //   dispatch(setNotificationFlag(!notificationFlag))

  //   function convertPageOrAll(value) {
  //     if (typeof value === 'number') {
  //       return value === 0 ? 'A' : 'P'
  //     }

  //     return value
  //   }

  //   const selectPageOrAll =
  //     dataForExcelDump.length && dataForExcelDump.map(i => convertPageOrAll(i.selectPageorAll)).join('')
  //   const requestEntity = 'print'
  //   const page = dataForExcelDump.length && dataForExcelDump.map(i => i.page).join('')

  //   const articleIds = dataForExcelDump.length && dataForExcelDump.map(i => i.articleId).flat()
  //   const recordsPerPage = dataForExcelDump.length && dataForExcelDump.map(i => i.recordsPerPage).join('')

  //   const media =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.media)
  //       .flat()
  //       .join(',')
  //       .replace(/^,+/g, '')
  //       .replace(/,+/g, ',')
  //       .replace(/,+$/, '')

  //   const geography =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.geography)
  //       .flat()
  //       .join(',')
  //       .replace(/,+$/, '')

  //   const language =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.language)
  //       .flat()
  //       .join(',')
  //       .replace(/^,+/g, '')
  //       .replace(/,+/g, ',')
  //       .replace(/,+$/, '')

  //   const tags =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.tags)
  //       .flat()
  //       .join(',')
  //       .replace(/^,+/g, '')
  //       .replace(/,+/g, ',')
  //       .replace(/,+$/, '')

  //   const headline =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.headline)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const body =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.body)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const journalist =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.journalist)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const wordCombo =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.wordCombo)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const anyWord =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.anyWord)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const ignoreWords =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.ignoreWords)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const phrase =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.phrase)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const sortby =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.sortby)
  //       .flat()
  //       .join('')
  //       .replace(/,+$/, '')

  //   const publicationCategory =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.publicationCategory)
  //       .flat()
  //       .join(',')
  //       .replace(/^,+/g, '')
  //       .replace(/,+/g, ',')
  //       .replace(/,+$/, '')

  //   const editionType =
  //     dataForExcelDump.length &&
  //     dataForExcelDump
  //       .map(i => i.editionType)
  //       .flat()
  //       .join(',')
  //       .replace(/^,+/g, '')
  //       .replace(/,+/g, ',')
  //       .replace(/,+$/, '')

  //   const searchCriteria = {
  //     selectPageOrAll,
  //     requestEntity,
  //     ...(selectPageOrAll !== 'A' && { page }),
  //     ...(selectPageOrAll !== 'A' && { recordsPerPage }),
  //     clientIds: clientId
  //   }

  //   if (editionType !== '') {
  //     searchCriteria.editionType = editionType
  //   }

  //   if (publicationCategory !== '') {
  //     searchCriteria.publicationCategory = publicationCategory
  //   }

  //   if (sortby !== '') {
  //     searchCriteria.sortby = sortby
  //   }

  //   if (body !== '') {
  //     searchCriteria.body = body
  //   }

  //   if (journalist !== '') {
  //     searchCriteria.journalist = journalist
  //   }

  //   if (wordCombo !== '') {
  //     searchCriteria.wordCombo = wordCombo
  //   }

  //   if (anyWord !== '') {
  //     searchCriteria.anyWord = anyWord
  //   }

  //   if (ignoreWords !== '') {
  //     searchCriteria.ignoreWords = ignoreWords
  //   }

  //   if (phrase !== '') {
  //     searchCriteria.phrase = phrase
  //   }

  //   if (headline !== '') {
  //     searchCriteria.headline = headline
  //   }

  //   if (media !== '') {
  //     searchCriteria.media = media
  //   }

  //   if (geography !== '') {
  //     searchCriteria.geography = geography
  //   }

  //   if (language != '') {
  //     searchCriteria.language = language
  //   }

  //   if (tags != '') {
  //     searchCriteria.tags = tags
  //   }

  //   searchCriteria.fromDate = formattedStartDate
  //   searchCriteria.toDate = formattedEndDate

  //   const postDataParams = {
  //     clientId,
  //     selectedFields,
  //     notificationFlag
  //   }

  //   if (pageCheck === true || allCheck === true) {
  //     postDataParams.searchCriteria = searchCriteria
  //   } else {
  //     postDataParams.articleIds = articleIds.filter(id => id !== undefined)
  //   }

  //   if (
  //     (media === '' &&
  //       geography === '' &&
  //       language === '' &&
  //       tags === '' &&
  //       [media, geography, language, tags].some(field => field.includes('articleId'))) ||
  //     (articleIds.length && articleIds.some(id => id !== undefined))
  //   ) {
  //   } else {
  //     postDataParams.searchCriteria = searchCriteria
  //   }

  //   postData(postDataParams)

  //   dispatch(setNotificationFlag(!notificationFlag))
  //   dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
  //   handleClose()
  //   setSelectedFields([])
  //   setSelectAll(false)
  //   if (error) return toast.error('something wrong.')
  //   if (responseData?.message) {
  //     responseData.message && toast.success(responseData.message)
  //   }
  // }
  const handleDownload = () => {
    dispatch(setNotificationFlag(!notificationFlag))

    const joinAndClean = arr =>
      arr
        .flat()
        .join(',')
        .replace(/^,+|,+$/g, '')

    const convertPageOrAll = value => (typeof value === 'number' ? (value === 0 ? 'A' : 'P') : value)

    const extractField = field => (dataForExcelDump.length ? joinAndClean(dataForExcelDump.map(i => i[field])) : '')

    const selectPageOrAll = dataForExcelDump.length
      ? dataForExcelDump.map(i => convertPageOrAll(i.selectPageorAll)).join('')
      : ''
    const page = extractField('page')

    const articleIds = dataForExcelDump.length
      ? dataForExcelDump
          .map(i => i.articleId)
          .flat()
          .filter(id => id !== undefined)
      : []
    const recordsPerPage = extractField('recordsPerPage')
    const media = extractField('media')
    const geography = extractField('geography')
    const language = extractField('language')
    const tags = extractField('tags')
    const headline = extractField('headline')
    const body = extractField('body')
    const journalist = extractField('journalist')
    const wordCombo = extractField('wordCombo')
    const anyWord = extractField('anyWord')
    const ignoreWords = extractField('ignoreWords')
    const phrase = extractField('phrase')
    const sortby = extractField('sortby')
    const publicationCategory = extractField('publicationCategory')
    const editionType = extractField('editionType')

    const searchCriteria = {
      selectPageOrAll,
      requestEntity: 'print',
      ...(selectPageOrAll !== 'A' && { page, recordsPerPage }),
      clientIds: clientId,
      ...(editionType && { editionType }),
      ...(publicationCategory && { publicationCategory }),
      ...(sortby && { sortby }),
      ...(body && { body }),
      ...(journalist && { journalist }),
      ...(wordCombo && { wordCombo }),
      ...(anyWord && { anyWord }),
      ...(ignoreWords && { ignoreWords }),
      ...(phrase && { phrase }),
      ...(headline && { headline }),
      ...(media && { media }),
      ...(geography && { geography }),
      ...(language && { language }),
      ...(tags && { tags }),
      fromDate: formattedStartDate,
      toDate: formattedEndDate
    }

    const postDataParams = {
      clientId,
      selectedFields,
      notificationFlag,
      ...(pageCheck || allCheck ? { searchCriteria } : { articleIds })
    }

    postData(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setSelectedFields([])
    setSelectAll(false)

    if (responseData) {
      toast.success(responseData.message)
      setSelectedArticles([])
    } else {
      toast.success('Something went wrong.')
    }
  }

  const hasArticleIdOrPageOrAll = dataForExcelDump.some(
    item => (item.articleId && item.articleId.length > 0) || item.selectPageorAll
  )

  if (!hasArticleIdOrPageOrAll) {
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
                  <Checkbox
                    checked={selectedFields.includes(item.name)}
                    onChange={() => handleCheckboxChange(item.name)}
                  />
                }
                label={item.description}
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
