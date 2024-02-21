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

const ChartjsTable = ({ tableData }) => {
  return (
    <Card>
      <CardHeader title='Article Count by Company' />
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
                <TableRow key={row.company}>
                  <TableCell component='th' scope='row'>
                    {row.company}
                  </TableCell>
                  <TableCell align='right'>{row.articleCount}</TableCell>
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
