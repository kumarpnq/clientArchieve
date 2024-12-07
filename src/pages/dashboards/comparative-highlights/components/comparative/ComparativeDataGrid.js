import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack
} from '@mui/material'
import React, { useState } from 'react'
import Searchbox from 'src/components/Searchbox'
import { Tab, Tabs } from 'src/components/Tabs'
import { All, Online, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useSelector } from 'react-redux'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'

function ComparativeDataGrid() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, startDate, endDate)
  const [collapse, setCollapse] = useState(false)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  const toggleCollapse = () => setCollapse(!collapse)

  return (
    <Card elevation={0} sx={{ p: 4 }} key='6'>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <div>
          <Typography
            variant='h5'
            fontWeight={500}
            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
          >
            Comparative Key Highlights
          </Typography>
          <Typography
            variant='body2'
            color='text.tertiary'
            sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
          >
            Keep track of companies and their reputation
          </Typography>
        </div>
        <Stack direction='row' alignItems='center' spacing={1.5} className='cancelSelection'>
          <Searchbox placeholder='Search' />
          <Button variant='outlined' startIcon={<FilterListIcon />} sx={{ borderRadius: 2, px: 6 }}>
            Filters
          </Button>
        </Stack>
      </Stack>

      <Tabs value={selectMediaType} onChange={changeMediaType} sx={{ mb: 4 }} className='cancelSelection'>
        <Tab label={All} value={All} />
        <Tab label={Print} value={Print} />
        <Tab label={Online} value={Online} />
      </Tabs>
      <TableContainer style={{ height: 380 }}>
        <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
          <TableHead>
            <TableRow>
              {[
                { title: 'Company', width: 130, align: 'left' },
                { title: 'Volume Rank', width: 100, align: 'center' },
                { title: 'Volume', width: 100, align: 'center' },
                { title: 'Volume SOV', width: 100, align: 'center' },
                { title: 'Visibility Rank', width: 100, align: 'center' },
                { title: 'Visibility', width: 100, align: 'center' },
                { title: 'Visibility SOV', width: 100, align: 'center' }
              ].map(col => (
                <TableCell key={col.title} style={{ minWidth: col.width }} align={col.align}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ transition: 'all ease-in 6s' }}>
            {data?.slice(0, 5).map((company, i) => (
              <TableRow
                key={company.key}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {company.key}
                </TableCell>

                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{i + 1}</Typography>
                </TableCell>
                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{Math.trunc(company.doc_count)}</Typography>
                </TableCell>
                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{Math.trunc(company.doc_sov)}</Typography>
                </TableCell>

                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{i + 1}</Typography>
                </TableCell>
                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{Math.trunc(company.V_Score.value)}</Typography>
                </TableCell>
                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{Math.trunc(company.V_Sov.value)}</Typography>
                </TableCell>
              </TableRow>
            ))}

            {collapse &&
              data?.slice(5).map((company, i) => (
                <TableRow
                  key={company.kay}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {company.kay}
                  </TableCell>

                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{i + 1}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(company.doc_count)}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(company.doc_sov)}</Typography>

                    <TableCell component='th' scope='row' align='center'>
                      <Typography variant='caption'>{i + 1}</Typography>
                    </TableCell>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(company.V_Score.value)}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(company.V_Sov.value)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant='text' className='cancelSelection' fullWidth onClick={toggleCollapse}>
        <Typography variant='subtitle1' color='primary.main'>
          {collapse ? 'Show less' : 'Show more'}
        </Typography>
      </Button>
    </Card>
  )
}

export default ComparativeDataGrid
