// EditJournalist.js
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

const EditJournalist = ({ articles, onCancel, handleClose }) => {
  const [articleData, setArticleData] = useState({
    headline: articles.headline,
    journalist: articles.articleJournalist
  })

  const handleSaveChanges = async () => {
    const { articleId } = articles

    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/updateArticleJournalist/`,
        {
          articleId: Number(articleId),
          newJournalist: articleData.journalist
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )

      handleClose()
    } catch (error) {
      toast.error('Error:', error.message)
    }
  }

  const handleInputChange = (field, value) => {
    setArticleData(prevData => ({ ...prevData, [field]: value }))
  }

  return (
    <Box sx={{ padding: '7px' }}>
      <Typography variant='h6' align='left' sx={{ marginBottom: 2 }}>
        Article Data
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {/* Grid for Article Data */}
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            size='small'
            label='Headline'
            variant='outlined'
            value={articleData.headline}
            onChange={e => handleInputChange('headline', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size='small'
            label='Journalist'
            variant='outlined'
            value={articleData.journalist}
            onChange={e => handleInputChange('journalist', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Save and Cancel Buttons */}
      <Grid container justifyContent='flex-end' sx={{ marginTop: 2 }}>
        <Button color='primary' onClick={handleSaveChanges}>
          Save
        </Button>
        <Button color='primary' onClick={onCancel} sx={{ marginLeft: 2 }}>
          Cancel
        </Button>
      </Grid>
    </Box>
  )
}

export default EditJournalist
