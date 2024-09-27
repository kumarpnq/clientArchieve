// ExcelDumpDialog.js
import React, { useState, useEffect } from 'react'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { getArticleFieldList } from '../../../../../api/print-headlines/dialog/ExcelDump/ExcelDumpDialogApi'
import useExcelDump from 'src/api/dump/useExcelDump'

// ** Redux
import { useSelector, useDispatch } from 'react-redux'
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
import WarningIcon from '@mui/icons-material/Warning'

// ** third party import
import toast from 'react-hot-toast'
import { Box, DialogContentText } from '@mui/material'
import { styled } from '@mui/material'
import dayjs from 'dayjs'

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

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
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const { responseData, loading, error, postData } = useExcelDump('print')
  const formattedStartDateTest = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD') : null
  const formattedEndDateTest = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD') : null

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

    const articleIdsWithType = articleIds.map(i => ({
      id: i,
      type: 'p'
    }))

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
      ...(selectPageOrAll !== 'A' && { page: Number(page), recordsPerPage: Number(recordsPerPage) }),
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
      fromDate: formattedStartDateTest,
      toDate: formattedEndDateTest
    }

    const postDataParams = {
      clientId,
      selectedFields,
      notificationFlag,

      ...(pageCheck || allCheck ? { searchCriteria } : { articleIdsWithType })
    }

    postData(postDataParams)

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setSelectedFields([])
    setSelectAll(false)

    if (responseData) {
      toast.success('Excel dump taken successfully.')

      // setSelectedArticles([])
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
        <PerfectScrollbarComponent>
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
        </PerfectScrollbarComponent>
      </DialogContent>
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
