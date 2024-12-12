import React, { useEffect, useState } from 'react'
import { City, PEERS_VOLUME_VISIBILITY, Print } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volScore', headerName: 'Vol', minWidth: 130 },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 130 },
  { field: 'visScore', headerName: 'Vis', minWidth: 130 },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 130 },
  { field: 'qe', headerName: 'QE', minWidth: 130 }
]

// const initialMetrics = { labels: [], bar: { Volume: [], Visibility: [] } }

function CityPerformance() {
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const [rows, setRows] = useState([])
  const { data, loading } = useChartAndGraphApi(PEERS_VOLUME_VISIBILITY, selectMediaType, City)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (!(data && data[selectedCategory])) return

    const newData = data[selectedCategory].CompanyTag?.FilterCompany?.Company?.buckets.map(data => {
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

    setRows(newData)
  }, [data, selectedCategory])

  return (
    <BroadWidget
      title='City Performance'
      description='Keep track of companies and their reputation'
      loading={loading}
      data={data}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}

      // charts={{ bar: { component: BarChart, props: { barPercentage: 0.3 } } }}
    />
  )
}

export default CityPerformance
