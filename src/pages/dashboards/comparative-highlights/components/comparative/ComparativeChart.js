import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'

const Widget = dynamic(() => import('src/components/widgets/Widget'))
const MixedChart = dynamic(() => import('src/components/charts/MixedChart'))
const DataGrid = dynamic(() => import('src/components/datagrid/DataGrid'))

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'visScore', headerName: 'V Score', minWidth: 150, description: 'Visibility score' },
  { field: 'imageScore', headerName: 'I Score', minWidth: 150, description: 'Image score' },
  { field: 'qe', headerName: 'QE', minWidth: 150, description: 'Quality of Exposure' }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Image: [], Visibility: [] } }

function Comparative(props) {
  const [selectMediaType, setSelectMediaType] = useState(Print)

  const [tableData, setTableData] = useState({ rows: [], visScore: [], imageScore: [], qe: [] })
  const [metrics, setMetrics] = useState(initialMetrics)

  const { data, loading } = useChartAndGraphApi({
    reportType: VISIBILITY_IMAGE_SCORE,
    mediaType: selectMediaType,
    path: 'data.doc.Report.CompanyTag.FilterCompany.Company.buckets'
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    const initialTable = { rows: [], visScore: [], imageScore: [], qe: [] }
    if (!data) {
      setMetrics(initialMetrics)
      setTableData(initialTable)

      return
    }

    const metrics = structuredClone(initialMetrics)
    const newTable = { ...initialTable }

    data.forEach(d => {
      metrics.labels.push(d.key)
      metrics.bar.Visibility.push(Math.trunc(d.V_Score.value))
      metrics.bar.Image.push(Math.trunc(d.I_Score.value))
      metrics.line.QE.push(Math.trunc(d.QE.value))

      newTable.rows.push(d.key),
        newTable.visScore.push(Math.trunc(d.V_Score.value)),
        newTable.imageScore.push(Math.trunc(d.I_Score.value)),
        newTable.qe.push(Math.trunc(d.QE.value))
    })

    setMetrics(metrics)

    setTableData(newTable)
  }, [data])

  return (
    <Widget
      title='Comparative Key Highlights'
      loading={loading}
      metrics={metrics}
      mediaType={selectMediaType}
      height={370}
      changeMediaType={changeMediaType}
      datagrid={{ columns, tableData }}
      render={['charts', 'table']}
      charts={{
        bar: { component: MixedChart, id: 'comparative-mixed-chart' }
      }}
      table={<DataGrid columns={columns} rows={tableData} />}
    />
  )
}

export default Comparative
