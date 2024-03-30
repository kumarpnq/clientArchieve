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
import { formatDateTime } from 'src/utils/formatDateTime'
import useExcelDump from 'src/api/dump/useExcelDump'
import { Box, DialogContentText } from '@mui/material'

const ExcelDumpDialog = ({ open, handleClose, dataForExcelDump }) => {
  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompanyIds = useSelector(selectSelectedCompetitions)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)
  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  // states
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const { responseData, loading, error, postData } = useExcelDump()
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const articleIds = dataForExcelDump.length > 0 && dataForExcelDump.flatMap(item => item.articleId)

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
      setSelectedFields([...fields.map(field => field.id)])
    } else {
      setSelectedFields([])
    }
  }, [selectAll, fields])

  const handleCheckboxChange = fieldId => {
    // Toggle individual checkbox
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

    const language =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.language)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const tags =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.tags)
        .flat()
        .join(',')
        .replace(/,+$/, '')

    const searchCriteria = { selectPageOrAll, requestEntity, page, recordsPerPage }

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
    postData(postDataParams)

    // const searchCriteria = {}
    // dataForExcelDump.forEach(item => {
    //   const [key] = Object.keys(item)
    //   const value = item[key]
    //   searchCriteria[key] = value
    // })
    // searchCriteria.fromDate = formattedStartDate
    // searchCriteria.toDate = formattedEndDate
    // searchCriteria.selectedCompanyIds = selectedCompanyIds

    // // Remove articleIds from searchCriteria
    // delete searchCriteria.articleId

    // postData({
    //   clientId,
    //   articleIds,
    //   selectedFields,
    //   searchCriteria,
    //   notificationFlag
    // })

    dispatch(setNotificationFlag(!notificationFlag))
    dispatch(setFetchAutoStatusFlag(!autoNotificationFlag ? true : autoNotificationFlag))
    handleClose()
    setSelectedFields([])
    setSelectAll(false)
    if (responseData.message) {
      responseData.message && toast.success(responseData.message)
    }
    if (error) return toast.error('something wrong.')
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
