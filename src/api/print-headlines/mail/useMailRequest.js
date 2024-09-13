import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useMailRequest = requestEntity => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const sendMailRequest = async ({ clientId, recipients, searchCriteria, articleIds }) => {
    const storedToken = localStorage.getItem('accessToken')

    try {
      const url = `${BASE_URL}/mailRequest/`

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const requestData = {
        requestEntity,
        articleIds,
        clientId,
        recipients,
        searchCriteria
      }

      const axiosConfig = {
        headers
      }

      const axiosResponse = await axios.post(url, JSON.stringify(requestData), axiosConfig)
      setResponse(axiosResponse.data)
    } catch (axiosError) {
      setError(axiosError)
    }
  }

  return { response, error, sendMailRequest }
}

export default useMailRequest
