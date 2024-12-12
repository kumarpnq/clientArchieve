import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useLoader from 'src/hooks/useLoader'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { Print } from 'src/constants/filters'
import { getDateRange } from 'src/store/apps/filters/filterSlice'

const URL = 'http://51.222.9.159:5000/api/v1/report/getChartAndGraphData'

export const useChartAndGraphApi = (reportType, mediaType, category, subCategory, range = 7) => {
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader({ initial: true })
  const filter = useSelector(state => state.filter)
  const selectedClient = useSelector(selectSelectedClient)
  const { from, to } = useSelector(getDateRange)

  const clientId = selectedClient ? selectedClient.clientId : null

  const formatTime = (date, setTime, isEnd) => {
    let formattedDate = date
    if (isEnd) {
      formattedDate = date.add(1, 'day')
    }
    const isoString = formattedDate.toISOString().slice(0, 10)
    const timeString = setTime ? (isEnd ? '23:59:59' : '12:00:00') : date.toISOString().slice(11, 19)

    return `${isoString} ${timeString}`
  }

  const formatDateTime = (mediaType, from, to) =>
    mediaType === Print
      ? { fromDate: from.format('YYYY-MM-DD'), toDate: to.format('YYYY-MM-DD') }
      : { fromDate: from.format('YYYY-MM-DD HH:mm:ss'), toDate: to.format('YYYY-MM-DD HH:mm:ss') }

  const filterParams = filter => {
    const params = {}
    for (let key in filter) {
      if (typeof filter[key] === 'string' && filter[key].trim() !== '' && filter[key] !== undefined)
        params[key] = filter[key]
    }

    return params
  }

  const fetchData = useCallback(async () => {
    if (!(clientId && filter?.companyIds)) return
    if (!(from && to)) return

    setData(null)
    start()

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }

      const urlParams = new URLSearchParams()
      const { companyIds, articleSize, ...filters } = filterParams(filter)
      const dates = formatDateTime(mediaType, from, to)
      companyIds?.split(',').forEach(id => urlParams.append('companyIds', id))
      articleSize?.split(',').forEach(id => urlParams.append('articleSize', id))

      const params = {
        ...dates,
        ...filters,
        reportType,
        mediaType,
        clientId,
        range,
        category,
        subCategory
      }

      // const URL = `http://127.0.0.1:5000/api/v1/report/getChartAndGraphData`

      const { data } = await axios.get(`${URL}/?${urlParams}`, { params, headers })

      const result = category
        ? data?.data?.doc?.Report[category]?.buckets
        : data?.data?.doc?.Report?.CompanyTag?.FilterCompany?.Company?.buckets

      setData(result || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end, clientId, filter, reportType, mediaType, from, to, range, category, subCategory])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
