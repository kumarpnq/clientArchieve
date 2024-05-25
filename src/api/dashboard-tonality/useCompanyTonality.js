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
import { formatDateTime } from 'src/utils/formatDateTime'

const useTonality = props => {
  const { media, endpoint, idType, isCompanyIds } = props

  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  useEffect(() => {
    const fetchData = async () => {
      const requestParams = {
        media: media,
        [idType]: clientId,

        // companyIds: selectedCompetitions,
        fromDate: formattedStartDate, //'2024-02-26 00:00:00',
        toDate: formattedEndDate //'2024-02-27 00:00:00'
      }
      if (isCompanyIds) {
        requestParams.companyIds = selectedCompetitions
      }
      try {
        const storedToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: requestParams
        })
        setChartData(
          response.data.companyTonality ||
            response.data.tonalityVscore ||
            response.data.clientTonality ||
            response.data.positiveTonality ||
            response.data.negativeTonality
        )
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId, selectedCompetitions, formattedEndDate, formattedStartDate, endpoint, media, idType, isCompanyIds])

  return { chartData, loading, error }
}

export default useTonality
