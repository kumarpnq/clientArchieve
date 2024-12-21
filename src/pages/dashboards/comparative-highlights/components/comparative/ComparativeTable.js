import dynamic from 'next/dynamic'
import { Box, Button, Card, IconButton, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { All, Online, Print, PEERS_VOLUME_VISIBILITY } from 'src/constants/filters'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import { Tab, Tabs } from 'src/components/Tabs'
import Loading from 'src/components/Loading'
import Widget from 'src/components/widgets/Widget'

const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 100, description: 'Volume Share of Voice' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' }
]

function ComparativeTable() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [tableData, setTableData] = useState({ rows: [], visScore: [], volScore: [], visSov: [], volSov: [] })

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
    const initialTable = { rows: [], visScore: [], volScore: [], visSov: [], volSov: [] }
    if (!data) {
      setTableData(initialTable)

      return
    }

    const newTable = { ...initialTable }

    data.forEach(d => {
      newTable.rows.push(d.key), newTable.volScore.push(Math.trunc(d.doc_count))
      newTable.volSov.push(Math.trunc(d.doc_sov))
      newTable.visScore.push(Math.trunc(d.V_Score.value))
      newTable.visSov.push(Math.trunc(d.V_Sov.value))
    })

    setTableData(newTable)
  }, [data])

  return (
    <Widget
      title='Comparative Key Highlights'
      loading={loading}
      mediaType={selectMediaType}
      height={320}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData }}
      render={['table']}
    />
  )
}

export default ComparativeTable
