import React, { useEffect, useMemo, useState } from 'react'
import { Print, PROMINENCE } from 'src/constants/filters'
import dynamic from 'next/dynamic'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const MixedChart = dynamic(() => import('src/components/charts/MixedChart'))
const CombinedBarChart = dynamic(() => import('src/components/charts/CombinedBarChart'))
const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))
const DataTable = dynamic(() => import('src/components/datatable/Table'))

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  {
    field: 'volSov',
    headerName: 'Vol SOV',
    minWidth: 100,
    description: 'Volume Share of Voice',
    renderCell: params => `${params.row.volSov}%`
  },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  {
    field: 'visSov',
    headerName: 'Vis SOV',
    minWidth: 100,
    description: 'Visibility Share of Voice',
    renderCell: params => `${params.row.visSov}%`
  }
]

const initialMetrics = { labels: [], line: { Volume: [] }, bar: { Visibility: [] } }
const tableRange = 5

const Title = 'Prominence Type Presence'
const Description = 'Keep track of companies and their reputation'

function ProminencePresence(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: PROMINENCE,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.Prominence.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <ProminenceTable
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  ) : (
    <ProminenceWidget
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  )
}

function ProminenceTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    volScore: [],
    volSov: [],
    visScore: [],
    visSov: [],
    columnGroup: []
  })
  const [selectedCategory, setSelectedCategory] = useState(-1)
  const { anchorEl, openMenu, closeMenu } = useMenu()

  // Memoize metrics to prevent unnecessary re-renders
  const metrics = useMemo(() => {
    // Ensure all data exists and is properly structured
    if (!tableData.rows.length || !tableData.columnGroup.length) return null

    return {
      labels: tableData.rows,
      labelGroup: tableData.columnGroup,
      bar: {
        Visibility: tableData.visScore.length ? tableData.visScore.map(scores => scores || [0]) : [[0]]
      },
      line: {
        Volume: tableData.volScore.length ? tableData.volScore.map(scores => scores || [0]) : [[0]]
      }
    }
  }, [tableData])

  useEffect(() => {
    // Reset table data
    const initialTableData = {
      rows: [],
      volScore: [],
      volSov: [],
      visScore: [],
      visSov: [],
      columnGroup: []
    }

    // Early return if no data
    if (!data || !data.length) {
      setTableData(initialTableData)

      return
    }

    // Create a deep clone of initial table data
    const tableData = { ...initialTableData }

    const prominences = selectedCategory !== -1 ? [data.at(selectedCategory)] : data

    // Process data with added safety checks
    prominences.forEach((dataItem, index) => {
      const companies = dataItem?.Company?.buckets || []

      // Collect company data
      const volScore = []
      const visScore = []
      const visSov = []
      const volSov = []

      companies.forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          tableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        volScore.push(Math.trunc(company.doc_count || 0))
        volSov.push(Math.trunc(company.doc_sov || 0))
        visScore.push(Math.trunc(company.V_Score?.value || 0))
        visSov.push(Math.trunc(company.V_Sov?.value || 0))
      })

      // Add column group and scores
      tableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      tableData.volScore.push(volScore)
      tableData.visSov.push(visSov)
      tableData.visScore.push(visScore)
      tableData.volSov.push(volSov)
    })

    // Update state
    setTableData(tableData)
  }, [data, selectedCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {(data[selectedCategory] || selectedCategory === -1) && (
        <Button size='small' onClick={openMenu} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory]?.key ?? 'All Prominences'}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
            maxHeight: 450,
            overflow: 'auto',

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
          selected={selectedCategory === -1}
          onClick={() => {
            setSelectedCategory(-1)
            closeMenu()
          }}
        >
          All Prominences
        </MenuItem>
        {data?.map((category, i) => (
          <MenuItem
            key={category.key}
            selected={selectedCategory === i}
            onClick={() => {
              setSelectedCategory(i)
              closeMenu()
            }}
          >
            {category.key}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  ) : null

  return (
    <BroadWidget
      title={Title}
      description={Description}
      loading={loading}
      mediaType={selectMediaType}
      apiActions={apiActions}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData, colGroupSpan: 4, id: 'prominence-table' }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart, id: 'prominence-combined-chart' } }}
    />
  )
}

function ProminenceWidget(props) {
  const { data, loading, changeMediaType, selectMediaType } = props
  const [rows, setRows] = useState([])

  const [selectedCategory, setSelectedCategory] = useState(0)
  const { anchorEl, openMenu, closeMenu } = useMenu()
  const [metrics, setMetrics] = useState(initialMetrics)

  useEffect(() => {
    setRows([])
    setMetrics(initialMetrics)
    if (!(data && data[selectedCategory])) return
    const metrics = structuredClone(initialMetrics)

    const newData = data[selectedCategory]?.Company?.buckets?.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))
      metrics.line.Volume.push(Math.trunc(data.doc_count))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        volSov: Math.trunc(data.doc_sov),
        visScore: Math.trunc(data.V_Score.value),
        visSov: Math.trunc(data.V_Sov?.value)
      }
    })

    setMetrics(metrics)
    setRows(newData)
  }, [data, selectedCategory])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory] && (
        <Button size='small' onClick={openMenu} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory].key}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.8),
            maxHeight: 450,
            overflow: 'auto',

            // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            border: '1px solid',
            borderColor: 'divider'
          },
          '& .MuiButtonBase-root:hover': {
            backgroundColor: 'background.default'
          }
        }}
      >
        {data?.map((category, i) => (
          <MenuItem
            key={category.key}
            selected={selectedCategory === i}
            onClick={() => {
              setSelectedCategory(i)
              closeMenu()
            }}
          >
            {category.key}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  ) : null

  return (
    <BroadWidget
      title={Title}
      description={Description}
      loading={loading}
      metrics={metrics}
      apiActions={apiActions}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      table={DataGrid}
      datagrid={{ columns, rows }}
      charts={{ bar: { component: MixedChart, id: 'prominence-mixed-chart' } }}
      render={['charts', 'table']}
    />
  )
}

export default ProminencePresence
