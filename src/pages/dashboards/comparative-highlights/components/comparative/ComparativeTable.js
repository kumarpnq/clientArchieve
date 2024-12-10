import {
  Box,
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
import React, { useEffect, useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { All, Online, Print, PEERS_VOLUME_VISIBILITY } from 'src/constants/filters'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDispatch } from 'react-redux'
import { getMediaType } from 'src/store/apps/filters/filterSlice'
import { useSelector } from 'react-redux'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import SearchIcon from '@mui/icons-material/Search'
import { Tab, Tabs } from 'src/components/Tabs'
import DataGrid from 'src/components/datagrid/DataGrid'

const columns = [
  { field: 'id', headerName: 'Id', minWidth: 100, align: 'left' },
  { field: 'key', headerName: 'Company', minWidth: 150, align: 'left' },
  { field: 'volScore', headerName: 'Volume', minWidth: 130, align: 'left' },
  { field: 'volSov', headerName: 'Volume SOV', minWidth: 130, align: 'left' },
  { field: 'visScore', headerName: 'V Score', minWidth: 130, align: 'left' },
  { field: 'visSov', headerName: 'Visibility SOV', minWidth: 130, align: 'left' }
]

function ComparativeTable() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [modifiedData, setModifiedData] = useState([])
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, startDate, endDate)
  const mediaType = useSelector(getMediaType)
  const dispatch = useDispatch()

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)

    // if (mediaType !== newValue) {
    //   dispatch(setMediaType(newValue))
    // }
  }

  useEffect(() => {
    if (!data) return

    const newData = data.map((d, i) => {
      return {
        id: d.key,
        key: d.key,
        volScore: d.doc_count,
        volSov: Math.trunc(d.doc_sov),
        visScore: Math.trunc(d.V_Score.value),
        visSov: Math.trunc(d.V_Sov.value)
      }
    })

    setModifiedData(newData)
  }, [data])

  return (
    <Card elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
      <Box flexGrow={1} className='cancelSelection'>
        <DataGrid columns={columns} rows={modifiedData} />
      </Box>
    </Card>
  )
}

export default ComparativeTable
