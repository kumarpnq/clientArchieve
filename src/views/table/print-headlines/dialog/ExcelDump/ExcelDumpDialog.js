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
import { selectSelectedClient, setNotificationFlag, selectNotificationFlag } from 'src/store/apps/user/userSlice'

const ExcelDumpDialog = ({ open, handleClose, dataForExcelDump }) => {
  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [fields, setFields] = useState({})
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const fetchData = useExcelDump()
  const dispatch = useDispatch()
  const notificationFlag = useSelector(selectNotificationFlag)

  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        if (storedToken) {
          const fields = await getArticleFieldList(storedToken)
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
      setSelectedFields(Object.keys(fields))
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
    fetchData({
      clientId,
      selectedFields,
      searchCriteria: dataForExcelDump.length > 0 ? dataForExcelDump : [],
      notificationFlag
    })
    dispatch(setNotificationFlag(!notificationFlag))
    handleClose()
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
          {Object.entries(fields).map(([fieldName, fieldLabel]) => (
            <Grid item xs={6} key={fieldName}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFields.includes(fieldName)}
                    onChange={() => handleCheckboxChange(fieldName)}
                  />
                }
                label={fieldLabel}
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
