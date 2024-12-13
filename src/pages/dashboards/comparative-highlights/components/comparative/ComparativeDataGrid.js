import { Card, Typography, Stack, Box, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'src/components/Tabs'
import { All, Online, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import DataGrid from 'src/components/datagrid/DataGrid'
import Toolbar from 'src/components/datagrid/Toolbar'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volRank', headerName: 'Vol Rank', minWidth: 100, description: 'Volume Rank' },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 100, description: 'Volume Share of Voice' },
  { field: 'visRank', headerName: 'Vis Rank', minWidth: 100, description: 'Visibility Rank' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' },
  { field: 'image', headerName: 'Image', minWidth: 100, description: 'Image score' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' },
  { field: 'reach', headerName: 'Reach', minWidth: 130, description: 'Reach' },
  { field: 'ave', headerName: 'AVE', minWidth: 130, description: 'AVE' }
]

function ComparativeDataGrid() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [modifiedData, setModifiedData] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    path: 'data.doc.Report.CompanyTag.FilterCompany.Company.buckets'
  })

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
        visSov: Math.trunc(d.V_Sov.value),
        image: Math.trunc(d.I_Score.value),
        qe: Math.trunc(d.QE.value),
        reach: Math.trunc(d.Reach.value),
        ave: Math.trunc(d.ADV.value)
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
