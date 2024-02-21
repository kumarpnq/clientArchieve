// ** React Imports
import React, { useEffect, useState } from 'react'

// ** axios
import axios from 'axios'

// ** day formatting
import dayjs from 'dayjs'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

// ... (imports)

const TopNewsToday = () => {
  const [loading, setLoading] = useState(false)
  const limit = 0
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const priorityCompanyId = selectedClient ? selectedClient.priorityCompanyId : ''
  const [topNews, setTopNews] = useState([])

  const getFormattedDate = inputDateString => {
    return dayjs(inputDateString).format('D MMMM YYYY')
  }
  useEffect(() => {
    const fetchLatestArticlesForCompetition = async () => {
      try {
        setLoading(true)
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const response = await axios.get('http://51.68.220.77:8001/latestArticlesForCompetition/', {
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
            setTopNews(...articles)
          }
        }
      } catch (error) {
        console.error('Error fetching user data and companies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticlesForCompetition()
  }, [clientId, priorityCompanyId, limit])

  return (
    <Card>
      <CardHeader title='Your Top News Today' />
      <CardContent>
        {loading && <CircularProgress />} {/* Show loading spinner when data is being fetched */}
        {!loading && topNews?.length === 0 && <Typography variant='body2'>No top news available.</Typography>}
        {!loading &&
          topNews.map(news => (
            <div key={news.articleId}>
              <Typography variant='h6' gutterBottom>
                {news.headline}
              </Typography>
              <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                {news.publication}, {getFormattedDate(news.articleDate)}
              </Typography>
              {topNews?.length - 1 && <Divider sx={{ marginY: 2 }} variant='fullWidth' />}{' '}
              {/* Add Divider with margin except for the last news item */}
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export default TopNewsToday
