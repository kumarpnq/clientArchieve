import axios from 'axios'
import { useState } from 'react'
import { BASE_URL } from 'src/api/base'

export const useDelete = () => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const deleteArticle = async ({ clientId, password, articleIds }) => {
    const storedToken = localStorage.getItem('accessToken')
    const url = `${BASE_URL}/deleteArticleForClient/`

    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const requestData = {
        clientId,
        password,
        articleIds
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
      console.log(error.message)
      setLoading(false)
    }
  }

  return { response, loading, error, deleteArticle }
}
