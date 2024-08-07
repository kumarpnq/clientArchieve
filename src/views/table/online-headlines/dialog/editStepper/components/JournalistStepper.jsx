// EditJournalist.js
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
import CustomTextField from 'src/@core/components/mui/text-field'

const JournalistStepper = ({ socialFeed, onCancel, handleClose }) => {
  const [editedSocialFeed, setEditedSocialFeed] = useState({
    headline: '',
    author: ''
  })
  const { author } = editedSocialFeed

  useEffect(() => {
    if (socialFeed) {
      setEditedSocialFeed({
        headline: socialFeed.headline || '',
        author: socialFeed.socialFeedAuthorName || ''
      })
    }
  }, [socialFeed])

  const handleDiscard = () => {
    setEditedSocialFeed({
      headline: socialFeed.headline || '',
      author: socialFeed.socialFeedAuthorName || ''
    })
    handleClose()
  }

  const [error, setError] = useState({
    headline: '',
    journalist: ''
  })

  const handleSaveChanges = async () => {
    const { socialFeedId } = socialFeed
    if (!editedSocialFeed.headline.length || !editedSocialFeed.journalist.length) {
      setError({
        headline: editedSocialFeed.headline.length ? '' : 'Please enter a headline',
        journalist: editedSocialFeed.journalist.length ? '' : 'Please enter a journalist'
      })

      return
    }
    try {
      const storedToken = localStorage.getItem('accessToken')

      const response = await axios.post(
        `${BASE_URL}/updateSocialFeedAuthorName/`,
        {
          articleId: Number(socialFeedId),
          newJournalistName: editedSocialFeed.journalist,
          newHeadline: editedSocialFeed.headline
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
    setEditedSocialFeed(prevData => ({ ...prevData, [field]: value }))
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
            value={editedSocialFeed.headline}
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
            value={editedSocialFeed.author}
            onChange={e => handleInputChange('author', e.target.value)}
          />
        </Grid>
        {/* Save and Cancel Buttons */}
        <Grid item xs={12} container justifyContent='flex-end'>
          <Button color='primary' variant='outlined' onClick={onCancel} sx={{ marginLeft: 2 }}>
            Close
          </Button>
          <Button
            variant='outlined'
            sx={{ bgcolor: 'primary.main', color: 'text.primary', ml: 2 }}
            onClick={handleSaveChanges}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default JournalistStepper
