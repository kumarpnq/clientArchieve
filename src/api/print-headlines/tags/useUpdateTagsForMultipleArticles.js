import { useState } from 'react'
import axios from 'axios'
import { BASE_URL, ELASTIC_SERVER } from 'src/api/base'

const useUpdateTagForMultipleArticles = props => {
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
        articleId: item?.articleId,
        articleType: 'print',
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

      const response = await axios.post(`${BASE_URL}/updateTagForMultipleArticles/`, requestData, {
        headers
      })

      const elasticResponse = await axios.put(
        `${ELASTIC_SERVER}/api/v1/internals/updateMultipleArticleTag`,
        elasticRequestData,
        { headers }
      )

      setResponseData({ fastAPI: response.data, elastic: elasticResponse.data })
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  return { loading, error, responseData, updateTagForMultipleArticles }
}

export default useUpdateTagForMultipleArticles
