import { Button, Card, Typography, Stack, Box, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Searchbox from 'src/components/Searchbox'
import { Tab, Tabs } from 'src/components/Tabs'
import { All, Online, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useSelector } from 'react-redux'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import DataGrid from 'src/components/datagrid/DataGrid'
import { GridToolbar } from '@mui/x-data-grid'
import Toolbar from 'src/components/datagrid/Toolbar'

const columns = [
  { field: 'id', headerName: 'Id', minWidth: 130, align: 'left' },
  { field: 'key', headerName: 'Company', minWidth: 200, align: 'left' },
  { field: 'volRank', headerName: 'Volume Rank', minWidth: 150, align: 'left' },
  { field: 'volScore', headerName: 'Volume', minWidth: 150, align: 'left' },
  { field: 'volSov', headerName: 'Volume SOV', minWidth: 150, align: 'left' },
  { field: 'visRank', headerName: 'Visibility Rank', minWidth: 150, align: 'left' },
  { field: 'visScore', headerName: 'Visibility', minWidth: 150, align: 'left' },
  { field: 'visSov', headerName: 'Visibility SOV', minWidth: 150, align: 'left' }
]

function ComparativeDataGrid() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [modifiedData, setModifiedData] = useState([])
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, startDate, endDate)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (!data) return

    const newData = data.map((d, i) => {
      return {
        id: d.key,
        key: d.key,
        volRank: i + 1,
        volScore: d.doc_count,
        volSov: Math.trunc(d.doc_sov),
        visRank: i + 1,
        visScore: Math.trunc(d.V_Score.value),
        visSov: Math.trunc(d.V_Sov.value)
      }
    })

    setModifiedData(newData)
  }, [data])

  return (
    <Card elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }} key='6'>
      <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
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
          <Tabs value={selectMediaType} onChange={changeMediaType} sx={{ mb: 4 }} className='cancelSelection'>
            <Tab label={All} value={All} />
            <Tab label={Print} value={Print} />
            <Tab label={Online} value={Online} />
          </Tabs>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box flexGrow={1} className='cancelSelection'>
        <DataGrid
          columns={columns}
          rows={modifiedData}
          slots={{
            toolbar: Toolbar
          }}
        />
      </Box>
    </Card>
  )
}

export default ComparativeDataGrid
