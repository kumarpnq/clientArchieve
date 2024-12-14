import React, { useEffect, useState } from 'react'
import { All, PEERS_VOLUME_VISIBILITY } from 'src/constants/filters'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import BroadWidget from 'src/components/widgets/BroadWidget'

const columns = [
  { field: 'key', headerName: 'Company', minWidth: 300 },
  { field: 'volRank', headerName: 'Vol Rank', minWidth: 100, description: 'Volume Rank' },
  { field: 'volScore', headerName: 'Vol', minWidth: 100, description: 'Volume' },
  { field: 'volSov', headerName: 'Vol SOV', minWidth: 100, description: 'Volume Share of Voice' },
  { field: 'visRank', headerName: 'Vis Rank', minWidth: 100, description: 'Visibility Rank' },
  { field: 'visScore', headerName: 'Vis', minWidth: 100, description: 'Visibility' },
  { field: 'visSov', headerName: 'Vis SOV', minWidth: 100, description: 'Visibility Share of Voice' },
  { field: 'image', headerName: 'Image', minWidth: 100, description: 'Image score' },
  { field: 'qe', headerName: 'QE', minWidth: 100, description: 'Quality of Exposure' },
  { field: 'reach', headerName: 'Reach', minWidth: 130, description: 'Reach' },
  { field: 'ave', headerName: 'AVE', minWidth: 130, description: 'AVE' }
]

function ComparativeDataGrid() {
  const [selectMediaType, setSelectMediaType] = useState(All)
  const [rows, setRows] = useState([])

  const { data, loading } = useChartAndGraphApi({
    reportType: PEERS_VOLUME_VISIBILITY,
    mediaType: selectMediaType,
    path: 'data.doc.Report.CompanyTag.FilterCompany.Company.buckets'
  })

  const changeMediaType = (event, newValue) => {
    setSelectMediaType(newValue)
  }

  useEffect(() => {
    if (!data) return

    const newData = data.map((d, i) => {
      return {
        id: d.key,
        key: d.key,
        volRank: i + 1,
        volScore: d.doc_count,
        volSov: Math.trunc(d.doc_sov),
        visScore: Math.trunc(d.V_Score.value),
        visSov: Math.trunc(d.V_Sov.value),
        image: Math.trunc(d.I_Score.value),
        qe: Math.trunc(d.QE.value),
        reach: Math.trunc(d.Reach.value),
        ave: Math.trunc(d.ADV.value)
      }
    })

    const sortedData = [...newData]
      .sort((a, b) => b.visScore - a.visScore) // Sort by visScore
      .map((item, index) => ({
        ...item,
        visRank: index + 1 // Assign visRank based on sorted order
      }))

    setRows(sortedData)
  }, [data])

  return (
    <BroadWidget
      title='Comparative Key Highlights'
      description='Keep track of companies and their reputation'
      loading={loading}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      datagrid={{ columns, rows }}
      render={['table']}
    />
  )
}

export default ComparativeDataGrid
