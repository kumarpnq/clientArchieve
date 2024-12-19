import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import { Language, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'

const MixedChart = dynamic(() => import('src/components/charts/MixedChart'))
const CombinedBarChart = dynamic(() => import('src/components/charts/CombinedBarChart'))
const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))
const DataTable = dynamic(() => import('src/components/datatable/Table'))

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' },
  {
    field: 'visSov',
    headerName: 'Vis SOV',
    minWidth: 100,
    description: 'Visibility Share of Voice',
    renderCell: params => `${params.row.visSov}%`
  }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Image: [], Visibility: [] } }
const tableRange = 5

const Title = 'Language Performance'
const Description = 'Keep track of companies and their reputation'

function LanguagePerformance(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    category: Language,
    path: `data.doc.Report.${Language}.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <LanguageTable data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  ) : (
    <LanguageWidget data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  )
}

function LanguageTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    volScore: [],
    visScore: [],
    visSov: [],
    qe: [],
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
        Volume: tableData.volScore.length ? tableData.volScore.map(scores => scores || [0]) : [[0]],
        Visibility: tableData.visScore.length ? tableData.visScore.map(scores => scores || [0]) : [[0]]
      },
      line: {
        QE: tableData.qe.length ? tableData.qe.map(scores => scores || [0]) : [[0]]
      }
    }
  }, [tableData])

  useEffect(() => {
    // Reset table data
    const initialTableData = {
      rows: [],
      volScore: [],
      visScore: [],
      visSov: [],
      qe: [],
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
    data.slice(0, tableRange).forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []

      // Collect company data
      const volScore = []
      const visScore = []
      const visSov = []
      const qe = []

      companies.slice(0, tableRange).forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          processedTableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        volScore.push(Math.trunc(company.doc_count ?? 0))
        visScore.push(Math.trunc(company.V_Score?.value ?? 0))
        visSov.push(Math.trunc(company.V_Sov?.value ?? 0))
        qe.push(Math.trunc(company.QE?.value ?? 0))
      })

      // Add column group and scores
      processedTableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      processedTableData.volScore.push(volScore)
      processedTableData.visSov.push(visSov)
      processedTableData.visScore.push(visScore)
      processedTableData.qe.push(qe)
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

function LanguageWidget(props) {
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

    const newData = data[selectedCategory].CompanyTag?.FilterCompany?.Company?.buckets.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))
      metrics.bar.Image.push(Math.trunc(data.I_Score.value))
      metrics.line.QE.push(Math.trunc(data.QE.value))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        volSov: Math.trunc(data.doc_sov),
        visScore: Math.trunc(data.V_Score.value),
        visSov: Math.trunc(data.V_Sov.value),
        qe: Math.trunc(data.QE.value)
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
      datagrid={{ columns, rows }}
      table={DataGrid}
      charts={{ bar: { component: MixedChart } }}
      render={['charts', 'table']}
    />
  )
}

export default LanguagePerformance
