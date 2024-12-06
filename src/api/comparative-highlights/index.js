import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useLoader from 'src/hooks/useLoader'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const URL = 'http://51.222.9.159:5000/api/v1/report/getChartAndGraphData'

export const useChartAndGraphApi = (reportType, mediaType) => {
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader()
  const filter = useSelector(state => state.filter)
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const filterParams = filter => {
    const params = {}
    for (let key in filter) {
      if (typeof filter[key] === 'string' && filter[key].trim() !== '') params[key] = filter[key]
    }

    return params
  }

  const fetchData = useCallback(async () => {
    start()
    try {
      if (!clientId && !filter?.companyIds) return

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }

      const filters = filterParams(filter)

      const params = {
        reportType,
        mediaType,
        clientId,
        fromDate: '2024-06-21',
        toDate: '2024-11-30',
        range: 7,
        ...filters
      }

      // const URL = `http://127.0.0.1:5000/api/v1/report/getChartAndGraphData`

      const response = await axios.get(URL, { params, headers })
      setData(response.data?.data?.doc?.Report?.Company?.buckets || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end, clientId, filter, reportType, mediaType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
