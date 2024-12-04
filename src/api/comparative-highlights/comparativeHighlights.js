import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import useLoader from 'src/hooks/useLoader'

export const useGetComparativeChart = () => {
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader()

  const fetchData = useCallback(async () => {
    start()
    const storedToken = localStorage.getItem('accessToken')
    try {
      let headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const params = {
        type: 'VISIBILITY_IMAGE_SCORE',
        indicis: 'Online',
        range: 7,
        fromDate: '2024-06-21',
        toDate: '2024-06-30'
      }

      const URL = `http://127.0.0.1:5000/api/v1/report/getChartAndGraphData`

      const response = await axios.get(URL, { headers, params })
      setData(response.data?.data?.doc?.Report?.Company?.buckets || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}

export const useTonalityDistribution = () => {
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader()

  const fetchData = useCallback(async () => {
    start()
    const storedToken = localStorage.getItem('accessToken')
    try {
      let headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const params = {
        type: 'VOLUME_RANKING',
        indicis: 'Online',
        range: 7,
        fromDate: '2024-06-21',
        toDate: '2024-06-30'
      }

      const URL = `http://127.0.0.1:5000/api/v1/report/getChartAndGraphData`

      const response = await axios.get(URL, { headers, params })
      setData(response.data?.data?.doc?.Report?.Company?.buckets || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
