import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const useClientWiseWordCloud = () => {
  const [clientWiseWordCloud, setClientWiseWordCloud] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const requestParamsArticlesWordCloud = {
    clientIds: clientId,
    fromDate: '2024-02-26 00:00:00',
    toDate: '2024-02-27 00:00:00'
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
  }, [clientId])

  return { clientWiseWordCloud, loading, error }
}

export default useClientWiseWordCloud
