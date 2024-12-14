import { Box, Button, Card, IconButton, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { All, Online, Print, PEERS_VOLUME_VISIBILITY } from 'src/constants/filters'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import { Tab, Tabs } from 'src/components/Tabs'
import DataGrid from 'src/components/datagrid/DataGrid'
import Loading from 'src/components/Loading'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 200 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 100, description: 'Volume Share of Voice' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' }
]

function ComparativeTable() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    path: 'data.doc.Report.CompanyTag.FilterCompany.Company.buckets'
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)

    // if (mediaType !== newValue) {
    //   dispatch(setMediaType(newValue))
    // }
  }

  useEffect(() => {
    setRows([])

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

    setRows(newData)
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

      {loading ? (
        <Loading />
      ) : (
        <>
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
            <DataGrid columns={columns} rows={rows} />
          </Box>
        </>
      )}
    </Card>
  )
}

export default ComparativeTable
