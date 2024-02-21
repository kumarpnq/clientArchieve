// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

const TopNewsToday = () => {
  // Define state to store the top news
  const [topNews, setTopNews] = useState([
    {
      title:
        '1TCC™ Expands Global Reach with Key Additions of Sabyasachi Mohapatra and Dr. Mangesh Gharfalkar to the Leadership Team',
      source: 'einnews.com',
      date: 'Dec 07,23'
    },
    {
      title:
        '1TCC™ Expands Global Reach with Key Additions of Sabyasachi Mohapatra and Dr. Mangesh Gharfalkar to the Leadership Team',
      source: 'headlinesoftoday.com',
      date: 'Dec 07,23'
    },
    {
      title: 'As a long-term investor, Tata Group best proxy to play the India story: Gautam Shah-Business Journal',
      source: 'business-journal.in',
      date: 'Dec 07,23'
    },
    {
      title: 'Odisha Cabinet approves Rs. 128.88 Cr utility corridor at Gopalpur',
      source: 'maritimegateway.com',
      date: 'Dec 07,23'
    },
    {
      title: 'Tata Group के इस शेयर से टूटा ब्रोकरेज फर्मों का भरोसा! जानें कब आएंगे इस स्टॉक के अच्छे दिन',
      source: 'jayka.in',
      date: 'Dec 07,23'
    },
    {
      title: 'Sat Industries Ltd Share Price Today, SATINDLTD Share Price NSE, BSE',
      source: 'businesstoday.in',
      date: 'Dec 07,23'
    },
    {
      title:
        'मिलिए उत्तर प्रदेश के सर्वश्रेष्ठ राज्य कर्मचारी से! 28 वर्षों से कर रहे हैं ये अद्भुत काम – Awam Ka Sach ( Meet the best state employee of Uttar Pradesh! Doing this amazing work for 28 years – Awam Ka Sach )',
      source: 'awamkasach.com',
      date: 'Dec 07,23'
    },
    {
      title:
        '1TCC™ Expands Global Reach with Key Additions of Sabyasachi Mohapatra and Dr. Mangesh Gharfalkar to the Leadership Team',
      source: 'einnews.com',
      date: 'Dec 07,23'
    },
    {
      title:
        'Chips to Startup programme underway; electronics manufacturing to hit $300 billion by 2026: IT MoS, ET Telecom',
      source: 'indiatimes.com',
      date: 'Dec 07,23'
    },
    {
      title:
        'Chugging Along A 112-Year-Old Railway Line With Rich Iron Ore Legacy — Ground Report From Tatanagar To GUMI In Odisha',
      source: 'swarajyamag.com',
      date: 'Dec 07,23'
    }

    // Add other news items here
  ])

  return (
    <Card>
      <CardHeader title='Your Top News Today' />

      <CardContent>
        {topNews.map((news, index) => (
          <div key={index}>
            <Typography variant='h6' gutterBottom>
              {news.title}
            </Typography>
            <Typography variant='subtitle2' color='textSecondary' gutterBottom>
              {news.source}, {news.date}
            </Typography>
            {index !== topNews.length - 1 && <Divider sx={{ marginY: 2 }} variant='middle' />}{' '}
            {/* Add Divider with margin except for the last news item */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopNewsToday
