import React, { useState, useEffect } from 'react'
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
import { formatDateTime } from 'src/utils/formatDateTime'

import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const ExcelDumpDialog = ({ open, handleClose, dataForExcelDump, pageCheck, allCheck }) => {
  const selectedClient = useSelector(selectSelectedClient)
  const selectedCompanyIds = useSelector(selectSelectedCompetitions)
  const clientId = selectedClient ? selectedClient.clientId : null
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)
  const formattedFromDate = selectedFromDate ? dayjs(selectedFromDate).format('YYYY-MM-DD HH:mm:ss') : null

  const formattedToDate = selectedEndDate ? dayjs(selectedEndDate).format('YYYY-MM-DD HH:mm:ss') : null

  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const { responseData, loading, error, postData } = useExcelDump('both')

  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)
  const autoNotificationFlag = useSelector(selectFetchAutoStatusFlag)

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
      const allIds = fields.map(i => i.name)
      setSelectedFields([...allIds])
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

    const articleIds = dataForExcelDump
      .filter(item => item.articleId)
      .flatMap(item => item.articleId)
      .filter(article => article.articleId)
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

    const sortby =
      dataForExcelDump.length &&
      dataForExcelDump
        .map(i => i.sortby)
        .flat()
        .join('')
        .replace(/,+$/, '')

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
        .map(i => i.editionType?.editionTypeId)
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
      const articleIdsWithType = articleIds.map(i => ({
        id: Number(i?.articleId),
        type: i?.articleType === 'online' ? 'o' : 'p'
      }))
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

    // setSelectedFields([])
    setSelectAll(false)
    if (error) return toast.error('something wrong.')
    if (responseData) {
      toast.success('Excel dump request taken successfully.')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm'>
      <DialogTitle color='primary'>Excel Dump</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
          label='Select All'
        />
        <Grid container spacing={2}>
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
