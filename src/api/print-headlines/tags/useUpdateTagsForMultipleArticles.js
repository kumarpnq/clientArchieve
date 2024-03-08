import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useUpdateTagForMultipleArticles = props => {
  const { clientId, article, tag } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [responseData, setResponseData] = useState(null)

  const updateTagForMultipleArticles = async () => {
    try {
      setLoading(true)

      const requestData = {
        clientId: clientId,
        article: article,
        tag: tag
      }

      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/updateTagForMultipleArticles/`, requestData, { headers })

      setResponseData(response.data)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  return { loading, error, responseData, updateTagForMultipleArticles }
}

export default useUpdateTagForMultipleArticles
