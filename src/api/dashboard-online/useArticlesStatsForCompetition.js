import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from '../base'

const useArticlesStatsForCompetition = selectedDateRange => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [shareOfVoiceData, setShareOfVoiceData] = useState([])

  useEffect(() => {
    const fetchArticlesStatsForCompetition = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        if (clientId) {
          let headers = {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }

          let params = { clientId, dateRange: selectedDateRange }

          const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')
          const URL = `${BASE_URL}/articlesStatsForCompetition?${queryString}`

          const response = await axios.get(URL, { headers })
          setShareOfVoiceData(response?.data?.statistics || [])

          return response?.data?.statistics || []
        } else {
          return []
        }
      } catch (error) {
        console.error('Error fetching articles stats for competition:', error)

        return []
      }
    }

    fetchArticlesStatsForCompetition()
  }, [clientId, selectedDateRange])

  return shareOfVoiceData
}

export default useArticlesStatsForCompetition
