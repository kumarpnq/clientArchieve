import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import { Journalist, Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'
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
  { field: 'visScore', headerName: 'Vis', minWidth: 150, description: 'Visibility' },
  { field: 'qe', headerName: 'QE', minWidth: 150, description: 'Quality of Exposure' }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Visibility: [] } }
const tableRange = 5

const Title = 'Journalist Performance'
const Description = 'Keep track of companies and their reputation'

function JournalistPerformance(props) {
  const { matches } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const { data, loading } = useChartAndGraphApi({
    reportType: VISIBILITY_IMAGE_SCORE,
    mediaType: selectMediaType,
    category: Journalist,
    path: `data.doc.Report.${Journalist}.buckets`
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
    setSelectedCategory(0)
  }

  return matches ? (
    <JournalistTable
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  ) : (
    <JournalistWidget
      data={data}
      loading={loading}
      selectMediaType={selectMediaType}
      changeMediaType={changeMediaType}
    />
  )
}

function JournalistTable(props) {
  const { data, loading, changeMediaType, selectMediaType } = props

  const [tableData, setTableData] = useState({
    rows: [],
    visScore: [],
    qe: [],
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
        QE: tableData.qe.length ? tableData.qe.map(scores => scores || [0]) : [[0]]
      }
    }
  }, [tableData])

  useEffect(() => {
    // Reset table data
    const initialTableData = {
      rows: [],
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
    const tableData = { ...initialTableData }
    const journalists = selectedCategory !== -1 ? [data.at(selectedCategory)] : data

    // Process data with added safety checks
    journalists.forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []

      // Collect company data
      const visScore = []
      const qe = []

      companies.slice(0, tableRange).forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          tableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        visScore.push(Math.trunc(company.V_Score?.value || 0))
        qe.push(Math.trunc(company.QE?.value || 0))
      })

      // Add column group and scores
      tableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
      tableData.visScore.push(visScore)
      tableData.qe.push(qe)
    })

    // Update state
    setTableData(tableData)
  }, [data, selectedCategory])

  // Render only if metrics are available
  const apiActions = data ? (
    <Stack direction='row' spacing={2}>
      {(data[selectedCategory] || selectedCategory === -1) && (
        <Button size='small' onClick={openMenu} endIcon={<KeyboardArrowDown />}>
          {data[selectedCategory]?.key ?? 'All Journalists'}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        className='cancelSelection'
        variant='translucent'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)'
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
          All Journalists
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
      changeMediaType={changeMediaType}
      apiActions={apiActions}
      datagrid={{ columns, tableData, colGroupSpan: 2, id: 'journalist-table' }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart, id: 'journalist-combined-chart' } }}
    />
  )
}

function JournalistWidget(props) {
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

    const newData = data[selectedCategory]?.CompanyTag?.FilterCompany?.Company?.buckets?.map(data => {
      metrics.labels.push(data.key)
      metrics.bar.Visibility.push(Math.trunc(data.V_Score?.value))
      metrics.line.QE.push(Math.trunc(data.QE?.value))

      return {
        id: data.key,
        key: data.key,
        visScore: Math.trunc(data.V_Score?.value),
        qe: Math.trunc(data.QE?.value)
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
        variant='translucent'
        sx={{
          '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
            width: 'min(100%, 380px)'
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
      charts={{ bar: { component: MixedChart, id: 'journalist-mixed-chart' } }}
      render={['charts', 'table']}
    />
  )
}

export default JournalistPerformance
