import { useState } from 'react'
import axios from 'axios'
import { BASE_URL, ELASTIC_SERVER } from 'src/api/base'

const useUpdateTagForMultipleOnlineArticles = props => {
  const { clientId, article = [], tag } = props
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

      const articleForElastic = article.map(item => ({
        articleId: item?.socialFeedId,
        articleType: 'online',
        companyIds: item?.companyIds
      }))

      const elasticRequestData = {
        clientIds: clientId,
        article: articleForElastic,
        tags: tag
      }
      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/updateTagForMultipleOnlineArticles/`, requestData, { headers })

      const elasticResponse = await axios.put(
        `${ELASTIC_SERVER}/api/v1/internals/updateMultipleArticleTag/`,
        elasticRequestData,
        { headers }
      )

      setResponseData({ fastAPI: response.data, elastic: elasticResponse.data })
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, responseData, updateTagForMultipleArticles }
}

export default useUpdateTagForMultipleOnlineArticles
