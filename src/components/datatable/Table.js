import React, { Fragment, useMemo } from 'react'
import {
  Box,
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import DownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { exportColumnGroupTable } from './export'
import useMenu from 'src/hooks/useMenu'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const DataTable = React.memo(props => {
  const { columns, tableData, colGroupSpan = 4, id, height, slots = {}, slotProps = {} } = props

  // Memoize column fields to prevent unnecessary recalculations
  const columnFields = useMemo(() => columns.slice(1), [columns])
  const { anchorEl, closeMenu, openMenu } = useMenu()
  tableData.columnFields = columnFields
  tableData.id = id

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
    return tableData.columnGroup ? (
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
    ) : (
      <TableRow>
        {columns.map(col => (
          <TableCell key={col.headerName} sx={{ minWidth: col.minWidth }} align='center'>
            {col.headerName}
          </TableCell>
        ))}
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
                  <Typography variant='caption'>{tableData[colField.field][colGroupIndex][row] ?? '-'}</Typography>
                </TableCell>
              ))
            )
          : columnFields.map(colField => (
              <TableCell component='th' scope='row' align='center' key={colField}>
                <Typography variant='caption'>{tableData[colField.field][row] ?? '-'}</Typography>
              </TableCell>
            ))}
      </TableRow>
    ))
  }, [tableData, columnFields])

  const handleDownload = format => {
    if (tableData.rows.length > 0 && tableData.columnGroup.length > 0) {
      exportColumnGroupTable(tableData, format)
    }
  }

  const actions = (
    <Fragment>
      <Button
        variant='outlined'
        onClick={openMenu}
        startIcon={<DownloadOutlinedIcon />}
        endIcon={<KeyboardArrowDown />}
        sx={{
          alignItems: 'start',
          textTransform: 'capitalize',
          textWrap: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          borderColor: 'divider',
          py: 1
        }}
      >
        Export
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 220px)',
            mt: 2,
            p: 0.2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        <MenuItem
          sx={{ px: 1.2 }}
          onClick={() => {
            handleDownload('xlsx')
            closeMenu()
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Download as XLSX</ListItemText>
        </MenuItem>
        <MenuItem
          sx={{ px: 1.2 }}
          onClick={() => {
            handleDownload('csv')
            closeMenu()
          }}
        >
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Download as CSV</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  )

  return (
    <Box>
      {slots.toolbar && <slots.toolbar {...slotProps.toolbar} actions={actions} />}
      <TableContainer sx={{ flexGrow: 1, height: height || 425 }}>
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
