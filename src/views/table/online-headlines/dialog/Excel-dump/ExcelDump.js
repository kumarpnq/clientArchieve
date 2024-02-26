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
import axios from 'axios'

const ExcelDumpDialog = ({ open, handleClose }) => {
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  useEffect(() => {
    const fetchFieldList = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

        if (accessToken) {
          const response = await axios.get(`${BASE_URL}/onlineDownloadFieldList`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          setFields(response.data.publicationsTypeList)
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
      setSelectedFields(fields.map(field => field.fieldId))
    } else {
      // If "Select All" is unchecked, clear selected fields
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
    // Toggle "Select All" checkbox
    setSelectAll(prevSelectAll => !prevSelectAll)

    // Clear selected fields when "Select All" is unchecked
    setSelectedFields([])
  }

  const handleDownload = () => {
    console.log('Selected Fields:', selectedFields)
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
          {fields.map(field => (
            <Grid item xs={6} key={field.fieldId}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFields.includes(field.fieldId)}
                    onChange={() => handleCheckboxChange(field.fieldId)}
                  />
                }
                label={field.fieldName}
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
