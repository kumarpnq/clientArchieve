import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import { useSelector } from 'react-redux'
import {
  selectSelectedClient,
  selectSelectedCompetitions,
  selectSelectedStartDate,
  selectSelectedEndDate
} from 'src/store/apps/user/userSlice'
import { formatDateTime } from 'src/utils/formatDateTime'

const useClientWiseWordCloud = () => {
  const selectedCompetitions = useSelector(selectSelectedCompetitions)
  const selectedFromDate = useSelector(selectSelectedStartDate)
  const selectedEndDate = useSelector(selectSelectedEndDate)

  const formattedStartDate = selectedFromDate ? formatDateTime(selectedFromDate, true, false) : null
  const formattedEndDate = selectedEndDate ? formatDateTime(selectedEndDate, true, true) : null

  const [clientWiseWordCloud, setClientWiseWordCloud] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const requestParamsArticlesWordCloud = {
    clientIds: clientId,
    companyIds: selectedCompetitions,
    fromDate: formattedStartDate, //'2024-02-26 00:00:00',
    toDate: formattedEndDate //'2024-02-27 00:00:00'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}/clientWiseWordCloud`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: requestParamsArticlesWordCloud
        })
        setClientWiseWordCloud(response.data.wordCloudData.wordData)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId, selectedCompetitions, selectedFromDate, selectedEndDate])

  return { clientWiseWordCloud, loading, error }
}

export default useClientWiseWordCloud
