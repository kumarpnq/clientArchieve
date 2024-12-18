import React, { useEffect, useState } from 'react'
import { Journalist, Print, TONALITY_BREAKUP } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'
import { Button, Menu, MenuItem, Stack } from '@mui/material'
import useMenu from 'src/hooks/useMenu'
import StackChart from 'src/components/charts/StackChart'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import DataGrid from 'src/components/datagrid/DataGrid'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'positive', headerName: 'Positive', minWidth: 150, description: 'Positive' },
  { field: 'neutral', headerName: 'Neutral', minWidth: 150, description: 'Neutral' },
  { field: 'negative', headerName: 'Negative', minWidth: 150, description: 'Negative' }
]

const initialMetrics = { labels: [], stack: { Positive: [], Neutral: [], Negative: [] } }

function JournalistTonality() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: TONALITY_BREAKUP,
    mediaType: selectMediaType,
    category: Journalist,
    path: `data.doc.Report.CompanyTag.FilterCompany.Company.buckets`
  })
  const [metrics, setMetrics] = useState(initialMetrics)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    setRows([])
    setMetrics(initialMetrics)

    if (!data) return
    const metrics = structuredClone(initialMetrics)

    const newData = data.map(data => {
      metrics.labels.push(data.key)
      metrics.stack.Positive.push(Math.trunc(data.Positive.value))
      metrics.stack.Neutral.push(Math.trunc(data.Neutral.value))
      metrics.stack.Negative.push(Math.trunc(data.Negative.value))

      return {
        id: data.key,
        key: data.key,
        positive: Math.trunc(data.Positive?.value),
        neutral: Math.trunc(data.Neutral?.value),
        negative: Math.trunc(data.Negative?.value)
      }
    })
    setMetrics(metrics)
    setRows(newData)
  }, [data])

  return (
    <BroadWidget
      title='Colgate-Palmolive vs. Peers – Tonality Break-up'
      description='Keep track of companies and their reputation'
      loading={loading}
      metrics={metrics}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}
      table={DataGrid}
      charts={{ stack: { component: StackChart } }}
      render={['charts', 'table']}
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
    const processedTableData = { ...initialTableData }

    // Process data with added safety checks
    data.slice(0, tableRange).forEach((dataItem, index) => {
      const companies = dataItem?.CompanyTag?.FilterCompany?.Company?.buckets || []

      // Collect company data
      const visScore = []
      const qe = []

      companies.slice(0, tableRange).forEach((company, companyIndex) => {
        // Add row names only on first iteration
        if (index === 0) {
          processedTableData.rows.push(company.key || `Company ${companyIndex + 1}`)
        }

        // Safely extract and process values
        visScore.push(Math.trunc(company.V_Score?.value || 0))
        qe.push(Math.trunc(company.QE?.value || 0))
      })

      // Add column group and scores
      processedTableData.columnGroup.push(dataItem.key || `Group ${index + 1}`)
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
      datagrid={{ columns, tableData, colGroupSpan: 2 }}
      table={DataTable}
      metrics={metrics}
      render={['charts', 'table']}
      charts={{ bar: { component: CombinedBarChart } }}
    />
  )
}

export default JournalistTonality
