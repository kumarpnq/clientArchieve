import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const useGetTagsForArticle = ({ articleId, clientId, companyIds, fetchFlag }) => {
  const [tagsData, setTagsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/getTagsForArticle/`

      const storedToken = localStorage.getItem('accessToken')

      const headers = {
        Authorization: `Bearer ${storedToken}`
      }

      const params = {
        articleId,
        companyIds: companyIds,
        clientId
      }

      try {
        const response = await axios.get(url, { headers, params })
        setTagsData(response.data.tags)
      } catch (error) {
        setError(error.message || error.response?.data || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchFlag, articleId, clientId, companyIds])

  return { tagsData, loading, error }
}

export default useGetTagsForArticle
