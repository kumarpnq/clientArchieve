// PublicationInfo.js

import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'

const PublicationInfo = ({ articles }) => {
  // Dummy data for illustration
  const [publicationInfo, setPublicationInfo] = useState({
    mediaType: articles.publicationCategory,
    publicationType: articles.publicationType,
    publication: articles.publication,
    language: articles.language,
    pageNumber: articles.pageNumber,
    size: articles.size,
    circulation: articles.circulation,
    edition: articles.city
  })

  const formattedDate = new Date(articles.articleDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <Card sx={{ padding: '7px' }}>
      <Paper elevation={0} sx={{ flexGrow: 1, textAlign: 'left', padding: '7px' }}>
        <Typography
          component={'div'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ bgcolor: 'primary.main', color: 'text.primary', borderRadius: '2px', px: 1 }}
        >
          <Typography variant='h7'>{articles.headline}</Typography>
          <Typography variant='subtitle1'>{formattedDate}</Typography>
        </Typography>
      </Paper>
      {/* <Divider sx={{ marginBottom: 2 }} /> */}
      <Grid container spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {/* Grid for Header Information */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Media Type :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.mediaType}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Publication Type :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.publicationType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Publication :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.publication}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Language :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.language}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Page Number :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.pageNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Size :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.size}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Circulation :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.circulation}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Edition :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {publicationInfo.edition}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

export default PublicationInfo
