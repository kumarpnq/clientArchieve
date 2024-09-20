const { default: axios } = require('axios')
const { useState, useEffect } = require('react')
const { ELASTIC_SERVER } = require('../base')

const useElasticSocialFeedData = ({ fromDate }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          sortby: 'FEED_DATE',
          fromDate: '2024-07-01',
          page: 1,
          recordsPerPage: 20000
        }
        const response = await axios.get(`${ELASTIC_SERVER}/api/v1/client/getSocialFeed`, { params })
        const result = response.data?.data?.doc || []

        const socialFeeds = result.map(item => ({
          socialFeedId: item._source?.socialFeedId,
          headline: item._source?.headline || 'Test Headline', // not getting
          publisher: item._source?.publicationInfo?.name,
          summary: item._source?.feedData.summary,
          socialFeedlink: item._source?.feedInfo?.link,
          socialFeedAuthorName: item._source?.feedInfo?.author_name || 'Test Author', // not getting
          companies: item._source?.companyTag.map(company => ({
            id: company.id,
            name: company.name
          })),
          children: [] //not getting
        }))
        setData(socialFeeds || [])
      } catch (error) {
        console.log('Elastic social feed', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fromDate])

  return { data, loading, error }
}

export default useElasticSocialFeedData
