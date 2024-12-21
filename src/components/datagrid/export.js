import {
  GridCsvExportMenuItem,
  gridFilteredSortedRowIdsSelector,
  GridToolbarExportContainer,
  gridVisibleColumnFieldsSelector,
  useGridApiContext
} from '@mui/x-data-grid'
import React from 'react'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { MenuItem } from '@mui/material'
import * as XLSX from 'xlsx'

function getExcelData(apiRef) {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef)
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef)

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map(id => {
    const row = {}
    visibleColumnsField.forEach(field => {
      row[field] = apiRef.current.getCellParams(id, field).value
    })

    return row
  })

  return data
}

function ExportDataGrid() {
  const apiRef = useGridApiContext()

  function handleExport() {
    const data = getExcelData(apiRef)

    const worksheet = XLSX.utils.json_to_sheet(data)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet)
    XLSX.writeFile(workbook, `${document.title}.xlsx`, { compression: true })
  }

  return (
    <GridToolbarExportContainer endIcon={<KeyboardArrowDown />}>
      <MenuItem onClick={handleExport}>Download as XLSX</MenuItem>
      <GridCsvExportMenuItem />
    </GridToolbarExportContainer>
  )
}

export default ExportDataGrid
