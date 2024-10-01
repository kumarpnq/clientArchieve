import { Box, Paper, Typography, IconButton, Divider, CircularProgress } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { BASE_URL } from 'src/api/base'

const MainView = ({ article }) => {
  const [activeView, setActiveView] = useState({
    web: true,
    text: false
  })

  // * text from socialFeed
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGetText = async article => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('accessToken')
      const url = article?.socialFeedlink || article?.link

      const response = await axios.get(`${BASE_URL}/getSocialFeedText/?url=${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      setText(response.data.article_text)
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component={Paper}>
      <Divider sx={{ py: 1 }} />
      {/* Controls */}
      <Typography component={'div'} display={'flex'} alignItems={'center'} gap={1} pt={1}>
        <IconButton
          aria-label='web-view'
          sx={{
            bgcolor: activeView.web ? 'primary.main' : 'transparent',
            color: activeView.web ? 'text.primary' : 'primary'
          }}
          onClick={() =>
            setActiveView({
              web: true,
              text: false
            })
          }
        >
          <IconifyIcon icon={'lets-icons:view-alt-light'} />
        </IconButton>
        <Link
          href={article?.socialFeedlink || article?.link || ''}
          target='_blank'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <IconifyIcon icon={'ph:link-bold'} />
        </Link>
        <IconButton
          aria-label='text-view'
          sx={{
            bgcolor: activeView.text ? 'primary.main' : 'transparent',
            color: activeView.text ? 'text.primary' : 'primary'
          }}
          onClick={() => {
            handleGetText(article)
            setActiveView({
              web: false,
              text: true
            })
          }}
        >
          <IconifyIcon icon={'ph:text-t-thin'} />
        </IconButton>
      </Typography>
      <Divider sx={{ py: 1 }} />

      {/* actual view */}
      {activeView.text ? (
        <Box width={'100%'} px={4}>
          <Typography component={'span'} fontWeight='thin'>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              text
            )}
          </Typography>
        </Box>
      ) : (
        <iframe src={article?.socialFeedlink || article?.link} width={'100%'} height={'800px'} frameBorder='0' />
      )}
    </Box>
  )
}

export default MainView
