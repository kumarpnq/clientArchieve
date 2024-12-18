import React, { useEffect, useMemo, useState } from 'react'
import { EditionType, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import BarChart from 'src/components/charts/BarChart'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import DataGrid from 'src/components/datagrid/DataGrid'
import DataTable from 'src/components/datatable/Table'
import CombinedBarChart from 'src/components/charts/CombinedBarChart'

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

const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] } }
const initialTableData = { rows: [], volScore: [], volSov: [], visScore: [], visSov: [], columnGroup: [] }
const tableRange = 5

const Title = 'Media Type Performance'
const Description = 'Keep track of companies and their reputation'

function MediaType(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    category: EditionType,
    path: `data.doc.Report.${EditionType}.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <MediaTable data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  ) : (
    <MediaWidget data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  )
}

function MediaTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    volScore: [],
    volSov: [],
    visScore: [],
    visSov: [],
    columnGroup: []
  })

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
    const processedTableData = { ...initialTableData }

    // Process data with added safety checks
    data.slice(0, 5).forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []

      // Collect company data
      const volScore = []
      const visScore = []
      const visSov = []
      const volSov = []

      companies.slice(0, 5).forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          processedTableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        volScore.push(Math.trunc(company.doc_count || 0))
        volSov.push(Math.trunc(company.doc_sov || 0))
        visScore.push(Math.trunc(company.V_Score?.value || 0))
        visSov.push(Math.trunc(company.V_Sov?.value || 0))
      })

      // Add column group and scores
      processedTableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      processedTableData.volScore.push(volScore)
      processedTableData.visSov.push(visSov)
      processedTableData.visScore.push(visScore)
      processedTableData.volSov.push(volSov)
    })

    // Update state
    setTableData(processedTableData)
  }, [data])

  // Render only if metrics are available

  return (
    <BroadWidget
      title={Title}
      description={Description}
      loading={loading}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData, colGroupSpan: 4 }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart } }}
    />
  )
}

function MediaWidget(props) {
  const { data, loading, changeMediaType, selectMediaType } = props
  const { anchorEl: categoryAnchorEl, openMenu: openCategory, closeMenu: closeCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [tableData, setTableData] = useState(initialTableData)
  const [metrics, setMetrics] = useState(initialMetrics)

  useEffect(() => {
    setTableData([])
    setMetrics(initialMetrics)
    if (!(data && data[selectedCategory])) return
    const metrics = structuredClone(initialMetrics)

    const newData = data[selectedCategory]?.CompanyTag?.FilterCompany?.Company?.buckets?.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Volume.push(Math.trunc(data.doc_count))
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        volSov: Math.trunc(data.doc_sov),
        visScore: Math.trunc(data.V_Score.value),
        visSov: Math.trunc(data.V_Sov.value)
      }
    })

    setMetrics(metrics)
    setTableData(newData)
  }, [data, selectedCategory])

  useEffect(() => {
    setSelectedCategory(0)
  }, [selectMediaType])

  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {data[selectedCategory] && (
        <Button size='small' onClick={openCategory} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory].key}
        </Button>
      )}

      <Menu
        anchorEl={categoryAnchorEl}
        open={Boolean(categoryAnchorEl)}
        onClose={closeCategory}
        disableScrollLock
        className='cancelSelection'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)',
            py: 2,
            borderRadius: 2,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
              closeCategory()
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
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      apiActions={apiActions}
      datagrid={{ columns, rows: tableData }}
      table={DataGrid}
      charts={{ bar: { component: BarChart, props: { barPercentage: 0.3 } } }}
      render={['charts', 'table']}
    />
  )
}

export default MediaType
