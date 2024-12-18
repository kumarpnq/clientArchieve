import React, { useEffect, useMemo, useState } from 'react'
import { GENRE_THEME, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import MixedChart from 'src/components/charts/MixedChart'
import DataGrid from 'src/components/datagrid/DataGrid'
import CombinedBarChart from 'src/components/charts/CombinedBarChart'
import DataTable from 'src/components/datatable/Table'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' }

  // { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Image: [], Visibility: [] } }
const tableRange = 5

const Title = 'Theme Performance'
const Description = 'Keep track of companies and their reputation'

function ThemePerformance(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: GENRE_THEME,
    mediaType: selectMediaType,
    path: `data.doc.Report.CompanyTag.FilterCompany.ReportingSubject.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  return matches ? (
    <ThemeTable data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  ) : (
    <ThemeWidget data={data} loading={loading} selectMediaType={selectMediaType} changeMediaType={changeMediaType} />
  )
}

function ThemeTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    volScore: [],
    visScore: [],
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
        Visibility: tableData.visScore.length ? tableData.visScore.map(scores => scores || [0]) : [[0]],
        Volume: tableData.volScore.length ? tableData.volScore.map(scores => scores || [0]) : [[0]]
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
      const companies = dataItem?.Company?.buckets || []

      // Collect company data
      const volScore = []
      const visScore = []
      const qe = []

      companies.slice(0, 5).forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          processedTableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        volScore.push(Math.trunc(company.doc_count || 0))
        visScore.push(Math.trunc(company.V_Score?.value || 0))
        qe.push(Math.trunc(company.QE?.value || 0))
      })

      // Add column group and scores
      processedTableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      processedTableData.volScore.push(volScore)
      processedTableData.visScore.push(visScore)
      processedTableData.qe.push(qe)
    })

    // Update state
    setTableData(processedTableData)
  }, [data])

  return (
    <BroadWidget
      title={Title}
      description={Description}
      loading={loading}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData, colGroupSpan: 3 }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart } }}
    />
  )
}

function ThemeWidget(props) {
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

    const newData = data[selectedCategory].Company?.buckets.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score.value))
      metrics.bar.Image.push(Math.trunc(data.I_Score.value))
      metrics.line.QE.push(Math.trunc(data.QE.value))

      return {
        id: data.key,
        key: data.key,
        volScore: data.doc_count,
        visScore: Math.trunc(data.V_Score.value),
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

export default ThemePerformance
