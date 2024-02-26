import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'

const useLatestArticlesForCompetition = (clientId, priorityCompanyId, limit) => {
  const [topNews, setTopNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLatestArticlesForCompetition = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/latestArticlesForCompetition/`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            },
            params: {
              clientId: clientId,
              companyId: priorityCompanyId,
              limit
            }
          })

          const companies = response?.data?.companies
          if (companies) {
            const articles = companies.map(item => item.articles)
            setTopNews(articles.flat())
          }
        }
      } catch (error) {
        console.error('Error fetching latest articles for competition:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticlesForCompetition()
  }, [clientId, priorityCompanyId, limit])

  return { topNews, loading, error }
}

export default useLatestArticlesForCompetition
