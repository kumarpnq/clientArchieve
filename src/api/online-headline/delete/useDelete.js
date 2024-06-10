import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useDelete = () => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteSocialFeeds = async ({ clientId, password, socialFeedIds }) => {
    const storedToken = localStorage.getItem('accessToken')
    const url = `${BASE_URL}/deleteSocialFeedForClient/`

    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const requestData = {
        clientId,
        password,
        socialFeedIds
      }

      const axiosConfig = {
        headers,
        data: requestData
      }

      const res = await axios.delete(url, axiosConfig)
      setResponse(res.data)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return { response, loading, error, deleteSocialFeeds }
}

export default useDelete
