import React, { useEffect, useState } from 'react'
import MixedChart from 'src/components/charts/MixedChart'
import Widget from 'src/components/Widget'
import { useChartAndGraphApi } from 'src/api/comparative-highlights'
import { All, Print, VISIBILITY_IMAGE_SCORE } from 'src/constants/filters'
import { useSelector } from 'react-redux'
import { getMediaType } from 'src/store/apps/filters/filterSlice'
import { useDispatch } from 'react-redux'
import { selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import DataGrid from 'src/components/datagrid/DataGrid'

const columns = [
  { field: 'id', headerName: 'Id', minWidth: 100, align: 'left' },
  { field: 'key', headerName: 'Company', minWidth: 150, align: 'left' },
  { field: 'visScore', headerName: 'V Score', minWidth: 130, align: 'left' },
  { field: 'imageScore', headerName: 'I Score', minWidth: 130, align: 'left' },
  { field: 'qe', headerName: 'QE', minWidth: 130, align: 'left' }
]

function Comparative(props) {
  const { openMenu } = props
  const [selectMediaType, setSelectMediaType] = useState(Print)
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
  const [modifiedData, setModifiedData] = useState([])
  const { data, loading } = useChartAndGraphApi(VISIBILITY_IMAGE_SCORE, selectMediaType, startDate, endDate)
  const mediaType = useSelector(getMediaType)
  const dispatch = useDispatch()

  const changeMediaType = (event, newValue) => {
    console.log('New Value: ', newValue)
    setSelectMediaType(newValue)

    // if (mediaType !== newValue) {
    //   dispatch(setMediaType(newValue))
    // }
  }

  useEffect(() => {
    if (!data) return

    const newData = data.map((d, i) => {
      return {
        id: d.key,
        key: d.key,
        visScore: Math.trunc(d.V_Score.value),
        imageScore: Math.trunc(d.I_Score.value),
        qe: Math.trunc(d.QE.value)
      }
    })

    setModifiedData(newData)
  }, [data])

  return (
    <Widget
      title='Comparative Key Highlights'
      openMenu={openMenu}
      loading={loading}
      data={data}
      mediaType={selectMediaType}
      changeMediaType={changeMediaType}
      charts={{
        bar: { component: MixedChart }
      }}
      table={<DataGrid columns={columns} rows={modifiedData} />}
    />
  )
}

export default Comparative
