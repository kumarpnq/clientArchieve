import {
  Button,
  Card,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import Searchbox from 'src/components/Searchbox'
import { All, Online, Print, PEERS_VOLUME_VISIBILITY } from 'src/constants/filters'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDispatch } from 'react-redux'
import { getMediaType, setMediaType } from 'src/store/apps/filters/filterSlice'
import { useSelector } from 'react-redux'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import SearchIcon from '@mui/icons-material/Search'
import { Tab, Tabs } from 'src/components/Tabs'

function ComparativeTable() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, startDate, endDate)
  const mediaType = useSelector(getMediaType)
  const dispatch = useDispatch()
  const [collapse, setCollapse] = useState(false)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)

    // if (mediaType !== newValue) {
    //   dispatch(setMediaType(newValue))
    // }
  }

  const toggleCollapse = () => setCollapse(!collapse)

  return (
    <Card elevation={0} sx={{ p: 4 }} key='6'>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={1}>
        <Typography
          variant='subtitle1'
          fontWeight={500}
          sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '1' }}
        >
          Comparative Key Highlights
        </Typography>

        <Stack direction='row' alignItems='center' spacing={1} className='cancelSelection'>
          <Switch />
          <Button
            variant='outlined'
            startIcon={<FilterListIcon />}
            sx={{
              alignItems: 'start',
              textTransform: 'capitalize',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              py: 1
            }}
          >
            Filters
          </Button>

          <IconButton>
            <SearchIcon fontSize='small' />
          </IconButton>
          <IconButton>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </Stack>
      </Stack>

      <Tabs
        value={selectMediaType}
        onChange={changeMediaType}
        className='cancelSelection'
        sx={{
          mt: 0,
          mb: 2,

          '& .MuiTab-root': {
            m: 0,
            mr: 6,
            minWidth: 50,
            fontSize: 13
          }
        }}
      >
        <Tab label={All} value={All} />
        <Tab label={Print} value={Print} />
        <Tab label={Online} value={Online} />
      </Tabs>

      <TableContainer style={{ height: 280 }}>
        <Table stickyHeader sx={{ transition: 'height 1.5s ease, max-height 1.5s ease' }}>
          <TableHead>
            <TableRow>
              {[
                { title: 'Company', width: 130, align: 'left' },
                { title: 'Volume', width: 100, align: 'center' },
                { title: 'Volume SOV', width: 100, align: 'center' },
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
            {data?.slice(0, 5).map(company => (
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
                  <Typography variant='caption'>{Math.trunc(company.doc_count)}</Typography>
                </TableCell>
                <TableCell component='th' scope='row' align='center'>
                  <Typography variant='caption'>{Math.trunc(company.doc_sov)}</Typography>
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
              data?.slice(5).map(company => (
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
                    <Typography variant='caption'>{Math.trunc(company.doc_count)}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Typography variant='caption'>{Math.trunc(company.doc_sov)}</Typography>
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

export default ComparativeTable
