import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from '../base'

const usePrintArticleCountDistribution = () => {
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const [printArticleCountDistribution, setPrintArticleCountDistribution] = useState([])

  useEffect(() => {
    const fetchPrintArticleCountDistribution = async () => {
      const storedToken = localStorage.getItem('accessToken')
      try {
        if (clientId) {
          let headers = {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }

          let params = { clientId }

          const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')
          const URL = `${BASE_URL}/printArticleCountDistribution?${queryString}`

          const response = await axios.get(URL, { headers })
          setPrintArticleCountDistribution(response.data.articleCounts)

          return response.data.articleCounts
        } else {
          return []
        }
      } catch (error) {
        console.error('Error fetching print article count distribution:', error)

        return []
      }
    }

    fetchPrintArticleCountDistribution()
  }, [clientId])

  return printArticleCountDistribution
}

export default usePrintArticleCountDistribution
