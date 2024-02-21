// ** React Imports
import React, { useState } from 'react'

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

const TopNewsForCompetitors = () => {
  const [topNews, setTopNews] = useState([])

  const [selectedCompetitor, setSelectedCompetitor] = useState('')

  const newsForCompetitors = {
    TATA: [
      {
        title:
          'Chips to Startup programme underway; electronics manufacturing to hit $300 billion by 2026: IT MoS, ET Telecom',
        source: 'indiatimes.com',
        date: 'Dec 07,23'
      },
      {
        title: 'TATA Motors unveils new electric vehicle with advanced features',
        source: 'business-standard.com',
        date: 'Dec 07,23'
      },
      {
        title: 'TATA Group announces partnership with leading tech company for AI-driven innovations',
        source: 'technews.com',
        date: 'Dec 07,23'
      }
    ],
    INFOSYS: [
      {
        title: 'INFOSYS reports strong quarterly earnings, beats market expectations',
        source: 'moneycontrol.com',
        date: 'Dec 07,23'
      },
      {
        title: 'INFOSYS launches new digital transformation solutions for businesses',
        source: 'forbes.com',
        date: 'Dec 07,23'
      },
      {
        title: 'INFOSYS recognized as a top employer in the IT industry',
        source: 'timesofindia.com',
        date: 'Dec 07,23'
      }
    ],
    IKEA: [
      {
        title: 'IKEA introduces sustainable furniture line with eco-friendly materials',
        source: 'homedesignmagazine.com',
        date: 'Dec 07,23'
      },
      {
        title: 'IKEA to open new flagship store in major city, creating jobs and boosting local economy',
        source: 'retailnews.com',
        date: 'Dec 07,23'
      },
      {
        title: 'IKEA collaborates with renowned designer for exclusive home decor collection',
        source: 'architecturaldigest.com',
        date: 'Dec 07,23'
      }
    ]

    // Add news for other competitors here
  }

  const competitors = Object.keys(newsForCompetitors)

  const handleCompetitorChange = event => {
    setSelectedCompetitor(event.target.value)

    // Set top news for the selected competitor
    setTopNews(newsForCompetitors[event.target.value])
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
              <MenuItem key={competitor} value={competitor}>
                {competitor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {topNews.map((news, index) => (
          <div key={index}>
            <Typography variant='h6' gutterBottom>
              {news.title}
            </Typography>
            <Typography variant='subtitle2' color='textSecondary' gutterBottom>
              {news.source}, {news.date}
            </Typography>
            {index !== topNews.length - 1 && <Divider sx={{ marginY: 2 }} variant='middle' />}{' '}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopNewsForCompetitors
