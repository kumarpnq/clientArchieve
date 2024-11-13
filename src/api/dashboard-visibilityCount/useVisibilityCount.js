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

const useVisibilityCount = props => {
  const { media, endpoint } = props

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
        media: media,
        clientIds: 'HDFCERG',
        companyIds: selectedCompetitions,
        fromDate: formattedStartDate, //'2024-02-26 00:00:00',
        toDate: formattedEndDate //'2024-02-27 00:00:00'
      }
      try {
        const storedToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: requestParams
        })

        const data =
          (endpoint === '/volumeRanking/' && response.data.volumeRanking) ||
          (endpoint === '/reportingSubjectVscore/' && response.data.reportingSubjectVscore)
        setChartData(data)
      } catch (error) {
        console.log(error.message)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId, selectedCompetitions, formattedEndDate, formattedStartDate, endpoint, media])

  return { chartData, loading, error }
}

export default useVisibilityCount
