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
import { useSelector } from 'react-redux'

// ** third party imports
import toast from 'react-hot-toast'
import ArticleTagEdit from '../ArticleTagEdit'
import { Box } from '@mui/material'
import useGetTagsForArticle from 'src/api/online-headline/tag/useGetTagsForArtcile'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const EditDialog = ({ open, handleClose, socialFeed, fetchTagsFlag, setFetchTagsFlag }) => {
  const companyId = socialFeed?.companies.map(i => i.id).join()
  const articleId = socialFeed?.socialFeedId
  const [fetchFlag, setFetchFlag] = useState(false)
  console.log('article==>', socialFeed)

  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const [editedSocialFeed, setEditedSocialFeed] = useState({
    headline: '',
    author: ''
  })
  const { author } = editedSocialFeed

  const {
    tagsData,
    loading: fetchLoading,
    error: fetchError
  } = useGetTagsForArticle({
    articleId,
    clientId,
    companyIds: companyId,
    fetchFlag
  })

  console.log('tagsData==>', tagsData)

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
      const storedToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BASE_URL}/updateSocialFeedAuthorName/`,
        {
          socialFeedId: Number(socialFeedId),
          newAuthorName: author
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
        <DialogActions>
          <Button onClick={handleSaveChanges} color='primary' disabled={!author}>
            Save
          </Button>
          <Button onClick={handleDiscard} color='primary'>
            Cancel
          </Button>
        </DialogActions>

        <Box marginBottom={4}>
          <ArticleTagEdit
            fetchTagsFlag={fetchTagsFlag}
            setFetchTagsFlag={setFetchTagsFlag}
            articles={socialFeed}
            handleClose={handleClose}
          />
        </Box>
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
        {/* <Button onClick={handleDiscard} color='primary'>
          Discard
        </Button>
        <Button onClick={handleSaveChanges} color='primary' disabled={!author}>
          Save
        </Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
