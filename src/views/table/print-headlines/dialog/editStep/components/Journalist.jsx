// EditJournalist.js
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import CustomTextField from 'src/@core/components/mui/text-field'

const JournalistStepper = ({ articles, onCancel, handleClose }) => {
  const [articleData, setArticleData] = useState({
    headline: articles.headline,
    journalist: articles.articleJournalist
  })

  const [error, setError] = useState({
    headline: '',
    journalist: ''
  })

  const handleSaveChanges = async () => {
    const { articleId } = articles
    if (!articleData.headline.length || !articleData.journalist.length) {
      setError({
        headline: articleData.headline.length ? '' : 'Please enter a headline',
        journalist: articleData.journalist.length ? '' : 'Please enter a journalist'
      })

      return
    }
    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/updateArticleJournalistAndHeadline/`,
        {
          articleId: Number(articleId),
          newJournalistName: articleData.journalist,
          newHeadline: articleData.headline
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
      toast.success(response.data.message)

      // handleClose()
    } catch (error) {
      console.log(error)
      toast.error('Error:', error.message)
    }
  }

  const handleInputChange = (field, value) => {
    setArticleData(prevData => ({ ...prevData, [field]: value }))
  }

  return (
    <Box width={'100%'} display='flex' flexDirection='column'>
      <Grid container spacing={2}>
        {/* Grid for Headline */}
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            size='small'
            label='Headline'
            variant='outlined'
            error={!!error.headline} // Convert string to boolean
            helperText={error.headline}
            value={articleData.headline}
            onChange={e => handleInputChange('headline', e.target.value)}
          />
        </Grid>
        {/* Grid for Journalist */}
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            size='small'
            label='Journalist'
            variant='outlined'
            error={!!error.journalist} // Convert string to boolean
            helperText={error.journalist}
            value={articleData.journalist}
            onChange={e => handleInputChange('journalist', e.target.value)}
          />
        </Grid>
        {/* Save and Cancel Buttons */}
        <Grid item xs={12} container justifyContent='flex-end'>
          <Button color='primary' onClick={handleSaveChanges}>
            Save
          </Button>
          <Button color='primary' onClick={handleClose} sx={{ marginLeft: 2 }}>
            Close
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default JournalistStepper
