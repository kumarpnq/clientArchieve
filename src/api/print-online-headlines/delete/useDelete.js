import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useDelete = () => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteArticlesAndSocialFeeds = async ({ clientId, password, articleTypeAndIds }) => {
    const storedToken = localStorage.getItem('accessToken')
    const url = `${BASE_URL}/deleteArticleAndSocialFeedForClient`

    const req = {
      clientId,
      password,
      articleTypeAndIds
    }
    console.log(req)
    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const requestData = {
        clientId,
        password,
        articleTypeAndIds
      }
      const res = await axios.delete(url, { headers, data: requestData })
      setResponse(res.data)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return { response, error, loading, deleteArticlesAndSocialFeeds }
}

export default useDelete
