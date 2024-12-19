import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { Journalist, Print, TONALITY_BREAKUP } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'

const StackChart = dynamic(() => import('src/components/charts/StackChart'))
const BroadWidget = dynamic(() => import('src/components/widgets/BroadWidget'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))

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

export default JournalistTonality
