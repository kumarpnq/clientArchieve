// ** React Imports
import React, { useEffect, useState } from 'react'

// ** day formatting
import dayjs from 'dayjs'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import useUserDataAndCompanies from 'src/api/dashboard-online/useUserDataAndCompanies'
import useLatestArticlesForCompetition from 'src/api/dashboard-online/useLatesestArticleForComptitionTwo'

const TopNewsForCompetitors = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('')
  let limit = 0
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const getFormattedDate = inputDateString => {
    return dayjs(inputDateString).format('D MMMM YYYY')
  }

  const { competitors } = useUserDataAndCompanies(clientId)
  const { topNews, loading } = useLatestArticlesForCompetition(clientId, selectedCompetitor, limit)

  // const competitors = Object.keys(newsForCompetitors)

  const handleCompetitorChange = event => {
    setSelectedCompetitor(event.target.value)
  }

  return (
    <Card>
      <CardHeader title='Top News for Competitor Today' />
      <CardContent>
        <FormControl fullWidth variant='outlined' sx={{ marginBottom: 2 }}>
          <InputLabel id='competitor-label'>Select Competitor</InputLabel>
          <Select
            labelId='competitor-label'
            id='competitor'
            value={selectedCompetitor}
            onChange={handleCompetitorChange}
            input={<OutlinedInput label='Select Competitor' />}
          >
            {competitors.map(competitor => (
              <MenuItem key={competitor.companyId} value={competitor.companyId}>
                {competitor.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <>
          {loading ? (
            <Box>
              <CircularProgress />
            </Box>
          ) : topNews.length > 0 ? (
            topNews.map(news => (
              <div key={news.articleId}>
                <Typography
                  variant='h6'
                  gutterBottom
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {news.headline}
                </Typography>
                <Typography variant='subtitle2' color='textSecondary' gutterBottom>
                  {news.publication}, {getFormattedDate(news.articleDate)}
                </Typography>
                {topNews.length - 1 && <Divider sx={{ marginY: 2 }} variant='fullWidth' />}{' '}
              </div>
            ))
          ) : (
            <Typography variant='body2'>No news available.</Typography>
          )}
        </>
      </CardContent>
    </Card>
  )
}

export default TopNewsForCompetitors
