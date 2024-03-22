import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../base'

const useLatestArticlesForCompetition = (clientId, selectedCompetitor, limit) => {
  const [topNews, setTopNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestArticlesForCompetition = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const response = await axios.get(
            `${BASE_URL}/latestSocialFeedsForClientCompany/
`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              },
              params: {
                clientId: clientId,
                companyId: selectedCompetitor,
                limit
              }
            }
          )

          const companies = response?.data?.companies
          if (companies) {
            const articles = companies.map(item => item.articles)
            setTopNews(...articles)
          }
        }
      } catch (error) {
        console.error('Error fetching latest articles for competition:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticlesForCompetition()
  }, [selectedCompetitor, clientId, limit])

  return { topNews, loading }
}

export default useLatestArticlesForCompetition
