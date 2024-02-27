// EditJournalist.js

import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'

const EditJournalist = ({ articles, onSave, onCancel }) => {
  const [articleData, setArticleData] = useState({
    headline: articles.headline,
    journalist: articles.articleJournalist
  })

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
        <Button color='primary' onClick={() => onSave(articleData)}>
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
