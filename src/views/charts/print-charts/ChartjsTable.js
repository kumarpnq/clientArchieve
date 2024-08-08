// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DownloadIcon from '@mui/icons-material/Download'
import * as XLSX from 'xlsx'

const ChartjsTable = ({ tableData }) => {
  const handleDownload = () => {
    if (tableData && tableData.length > 0) {
      const flattenData = tableData.map(item => {
        return {
          'Company ID': item.companyId,
          'Company Name': item.companyName,
          'Articles Count': item.articlesCount
        }
      })

      if (flattenData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(flattenData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
        XLSX.writeFile(wb, 'exported_data.xlsx')
      } else {
        console.error('No valid data is available for download.')
      }
    } else {
      console.error('Data is not available for download.')
    }
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader title={`Article Count by Company`} />
        <IconButton onClick={handleDownload} disabled={tableData?.length <= 0}>
          <DownloadIcon />
        </IconButton>
      </Box>
      <CardContent>
        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell align='right'>Article Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map(row => (
                <TableRow key={row.companyId} sx={{ bgcolor: row.articlesCount === 0 ? '' : '' }}>
                  <TableCell component='th' scope='row'>
                    {row.companyName}
                  </TableCell>
                  <TableCell align='right'>{row.articlesCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ChartjsTable
