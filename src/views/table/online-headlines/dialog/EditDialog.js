// EditDialog.js
import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Iframe from 'react-iframe'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'

// ** third party imports
import toast from 'react-hot-toast'

const EditDialog = ({ open, handleClose, socialFeed, handleSave }) => {
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

  const handleInputChange = (field, value) => {
    setEditedSocialFeed(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveChanges = async () => {
    const { socialFeedId } = socialFeed
    try {
      if (socialFeedId) {
        const storedToken = localStorage.getItem('accessToken')
        if (storedToken) {
          const res = await axios.post(
            `${BASE_URL}/updateSocialFeedAuthorName/`,
            { socialFeedId, newAuthorName: author },
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            }
          )
          handleSave(editedSocialFeed)
          handleClose()
        } else {
          throw new Error('No access token in the local storage.')
        }
      } else {
        throw new Error('Invalid socialFeedId')
      }
    } catch (error) {
      toast.error('Error:', error.message)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      {/* Set maxWidth and fullWidth props */}
      <DialogTitle color='primary'>Edit Social Feed</DialogTitle>
      <DialogContent>
        <TextField
          label='Headline'
          value={editedSocialFeed.headline}
          onChange={e => handleInputChange('headline', e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Journalist'
          value={editedSocialFeed.author}
          onChange={e => handleInputChange('author', e.target.value)}
          fullWidth
          margin='normal'
        />
        <Iframe
          url={socialFeed?.socialFeedlink || ''}
          width='100%'
          height='500px'
          id='myId'
          className='myClassname'
          display='initial'
          position='relative'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDiscard} color='primary'>
          Discard
        </Button>
        <Button onClick={handleSaveChanges} color='primary' disabled={!author}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
