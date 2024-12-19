import React, { useMemo } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const DataTable = React.memo(({ columns, tableData, colGroupSpan = 4, slots = {}, slotProps = {} }) => {
  // Memoize column fields to prevent unnecessary recalculations
  const columnFields = useMemo(() => columns.slice(1).map(col => col.field), [columns])

  // Memoize table header rendering to optimize performance
  const renderColumnGroupHeader = useMemo(() => {
    if (!tableData.columnGroup) return null

    return (
      <TableRow>
        <TableCell />
        {tableData.columnGroup.map(col => (
          <TableCell key={col} colSpan={colGroupSpan} align='center'>
            {col}
          </TableCell>
        ))}
      </TableRow>
    )
  }, [tableData.columnGroup, colGroupSpan])

  // Memoize column headers rendering
  const renderColumnHeaders = useMemo(() => {
    if (!tableData.columnGroup) return null

    return (
      <TableRow>
        <TableCell sx={{ minWidth: columns[0].minWidth }}>{columns[0].headerName}</TableCell>
        {tableData.columnGroup.map(() =>
          columns.slice(1).map(col => (
            <TableCell key={col.headerName} sx={{ minWidth: 100 }} align='center'>
              {col.headerName}
            </TableCell>
          ))
        )}
      </TableRow>
    )
  }, [tableData.columnGroup, columns])

  // Render table rows with memoization
  const tableRows = useMemo(() => {
    return tableData.rows.map((label, row) => (
      <TableRow
        key={label}
        sx={{
          '&:last-child td, &:last-child th': {
            border: 0
          }
        }}
      >
        <TableCell component='th' scope='row' width={200}>
          {label}
        </TableCell>

        {tableData.columnGroup
          ? tableData.columnGroup.map((_, colGroupIndex) =>
              columnFields.map(colField => (
                <TableCell component='th' scope='row' align='center' key={`${colField}-${colGroupIndex}-${row}`}>
                  <Typography variant='caption'>{tableData[colField][colGroupIndex][row] ?? '-'}</Typography>
                </TableCell>
              ))
            )
          : columnFields.map(colField => (
              <TableCell component='th' scope='row' align='center' key={colField}>
                <Typography variant='caption'>{tableData[colField][row] ?? '-'}</Typography>
              </TableCell>
            ))}
      </TableRow>
    ))
  }, [tableData, columnFields])

  return (
    <Box>
      {slots.toolbar && <slots.toolbar {...slotProps.toolbar} actions={true} />}
      <TableContainer sx={{ flexGrow: 1, height: 425 }}>
        <Table stickyHeader>
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            {renderColumnGroupHeader}
            {renderColumnHeaders}
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
})

export default DataTable
