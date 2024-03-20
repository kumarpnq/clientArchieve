// EditJournalist.js

import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BASE_URL } from 'src/api/base'
<<<<<<< HEAD

const EditJournalist = ({ articles, onCancel, handleClose }) => {
  console.log('datamain==>', articles)

=======

<<<<<<< HEAD
const EditJournalist = ({ articles, onCancel,handleClose  }) => {

  console.log("datamain==>", articles)
>>>>>>> 55478af (done journalistu api intergrtion)
=======
const EditJournalist = ({ articles, onCancel, handleClose }) => {
  console.log('datamain==>', articles)
>>>>>>> 37e50fb (reomved consoles)
  const [articleData, setArticleData] = useState({
    headline: articles.headline,
    journalist: articles.articleJournalist
  })

  const handleSaveChanges = async () => {
<<<<<<< HEAD
<<<<<<< HEAD
    const { articleId } = articles
    console.log('articleId ==> ', articleId)

    try {
      const storedToken = localStorage.getItem('accessToken')
      console.log('storedToken ==> ', storedToken)

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

      console.log('Response from server ==> ', response.data)
      handleClose()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error:', error.message)
    }
  }
=======
    const { articleId } = articles;
    console.log("articleId ==> ", articleId);

=======
    const { articleId } = articles
>>>>>>> 37e50fb (reomved consoles)
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
<<<<<<< HEAD
}
>>>>>>> 55478af (done journalistu api intergrtion)
=======
  }
>>>>>>> 37e50fb (reomved consoles)

  const handleInputChange = (field, value) => {
    setArticleData(prevData => ({ ...prevData, [field]: value }))
  }

  return (
    <Card sx={{ padding: '7px' }}>
      <Typography variant='h6' align='center' sx={{ marginBottom: 2 }}>
        Article Data
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {/* Grid for Article Data */}
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label='Headline'
            variant='outlined'
            value={articleData.headline}
            onChange={e => handleInputChange('headline', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
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
    </Card>
  )
}

export default EditJournalist
