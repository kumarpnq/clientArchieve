import React, { useEffect, useState } from 'react'
import MixedChart from 'src/components/charts/MixedChart'
import Widget from 'src/components/widgets/Widget'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'
import { useSelector } from 'react-redux'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import DataGrid from 'src/components/datagrid/DataGrid'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 200 },
  { field: 'visScore', headerName: 'V Score', minWidth: 100, description: 'Visibility score' },
  { field: 'imageScore', headerName: 'I Score', minWidth: 100, description: 'Image score' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' }
]

const initialMetrics = { labels: [], line: { QE: [] }, bar: { Image: [], Visibility: [] } }

function Comparative(props) {
  const { openMenu } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])
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
    setRows([])
    setMetrics(initialMetrics)
    if (!data) return

    const metrics = structuredClone(initialMetrics)

    const newData = data.map(d => {
      metrics.labels.push(d.key)
      metrics.bar.Visibility.push(Math.trunc(d.V_Score.value))
      metrics.bar.Image.push(Math.trunc(d.I_Score.value))
      metrics.line.QE.push(Math.trunc(d.QE.value))

      return {
        id: d.key,
        key: d.key,
        visScore: Math.trunc(d.V_Score.value),
        imageScore: Math.trunc(d.I_Score.value),
        qe: Math.trunc(d.QE.value)
      }
    })

    setMetrics(metrics)

    setRows(newData)
  }, [data])

  return (
    <Widget
      title='Comparative Key Highlights'
      openMenu={openMenu}
      loading={loading}
      metrics={metrics}
      mediaType={selectMediaType}
      height={370}
      changeMediaType={changeMediaType}
      charts={{
        bar: { component: MixedChart }
      }}
      table={<DataGrid columns={columns} rows={rows} />}
    />
  )
}

export default Comparative
