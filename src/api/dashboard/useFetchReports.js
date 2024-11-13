import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate
} from 'src/store/apps/user/userSlice'
import { formatDateFromM } from 'src/utils/formatDateIso'

const useFetchReports = props => {
  const { media, endpoint, idType, isMedia, dataKey } = props

  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = formatDateFromM(selectedFromDate)
  const formattedEndDate = formatDateFromM(selectedEndDate)

  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  useEffect(() => {
    const fetchData = async () => {
      const requestParams = {
        // [idType]: clientId,
        [idType]: 'HDFCERG',

        // companyIds: selectedCompetitions,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
      }
      if (isMedia) {
        requestParams.media = media
      }
      try {
        const storedToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: requestParams
        })

        const key = dataKey.split("'").join('')
        const data = response.data[key]

        setChartData(data || [])
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId, selectedCompetitions, formattedEndDate, formattedStartDate, endpoint, media, idType, isMedia, dataKey])

  return { chartData, loading, error }
}

export default useFetchReports
