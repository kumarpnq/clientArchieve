import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useLoader from 'src/hooks/useLoader'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { Print } from 'src/constants/filters'
import { getDateRange } from 'src/store/apps/filters/filterSlice'
import { getValueFromPath } from 'src/utils/helper'
import { ELASTIC_SERVER } from '../base'

export const useChartAndGraphApi = config => {
  const { reportType, mediaType, category, subCategory, range = 10, path } = config
  const [data, setData] = useState(null)
  const { loading, start, end } = useLoader({ initial: true })
  const filter = useSelector(state => state.filter)
  const selectedClient = useSelector(selectSelectedClient)
  const { from, to } = useSelector(getDateRange)

  const clientId = selectedClient ? selectedClient.clientId : null

  const formatDateTime = (mediaType, from, to) =>
    mediaType === Print
      ? { fromDate: from?.format('YYYY-MM-DD'), toDate: to?.format('YYYY-MM-DD') }
      : { fromDate: from?.format('YYYY-MM-DD HH:mm:ss'), toDate: to?.format('YYYY-MM-DD HH:mm:ss') }

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
    if (!path) return

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

      const { data } = await axios.get(`${ELASTIC_SERVER}/?${urlParams}`, { params, headers })

      const result = getValueFromPath(data, path)

      setData(result || [])
    } catch (error) {
      console.error('Error fetching articles stats for competition:', error)
    } finally {
      end()
    }
  }, [start, end, clientId, filter, reportType, mediaType, from, to, range, category, subCategory, path])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
