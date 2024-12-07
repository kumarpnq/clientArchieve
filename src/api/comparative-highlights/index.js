import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useLoader from 'src/hooks/useLoader'
import { useSelector } from 'react-redux'
import { selectSelectedClient, selectSelectedEndDate, selectSelectedStartDate } from 'src/store/apps/user/userSlice'
import { All, Online } from 'src/constants/filters'

const URL = 'http://51.222.9.159:5000/api/v1/report/getChartAndGraphData'

export const useChartAndGraphApi = (reportType, mediaType) => {
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader()
  const filter = useSelector(state => state.filter)
  const selectedClient = useSelector(selectSelectedClient)
  const startDate = useSelector(selectSelectedStartDate)
  const endDate = useSelector(selectSelectedEndDate)
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

  const formatDateTime = useCallback((mediaType, from, to) => {
    const dates = {
      fromDate: new Date(from),
      toDate: new Date(to)
    }

    if (mediaType === Online || mediaType === All) {
      dates.fromDate = formatTime(dates.fromDate)
      dates.toDate = formatTime(dates.toDate)

      return dates
    }

    dates.fromDate = dates.fromDate.toISOString().slice(0, 10)
    dates.toDate = dates.toDate.toISOString().slice(0, 10)

    return dates
  }, [])

  const filterParams = filter => {
    const params = {}
    for (let key in filter) {
      if (typeof filter[key] === 'string' && filter[key].trim() !== '') params[key] = filter[key]
    }

    return params
  }

  const fetchData = useCallback(async () => {
    if (!(clientId && filter?.companyIds)) return
    if (!(startDate && endDate)) return
    console.log('Media Type: ', mediaType)

    start()
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }

      const urlParams = new URLSearchParams()
      const { companyIds, ...filters } = filterParams(filter)
      const dates = formatDateTime(mediaType, startDate, endDate)
      companyIds.split(',').forEach(id => urlParams.append('companyIds', id))

      const params = {
        ...dates,
        ...filters,
        reportType,
        mediaType,
        clientId,
        range: 7
      }

      // const URL = `http://127.0.0.1:5000/api/v1/report/getChartAndGraphData`

      const response = await axios.get(`${URL}/?${urlParams}`, { params, headers })
      setData(response.data?.data?.doc?.Report?.Company?.buckets || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end, clientId, filter, reportType, mediaType, startDate, endDate, formatDateTime])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
