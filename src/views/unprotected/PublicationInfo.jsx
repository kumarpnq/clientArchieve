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
    edition: articles.editionTypeName
  })

  const formattedDate = new Date(articles.articleDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <Card sx={{ padding: '7px' }}>
      <Paper elevation={0} sx={{ flexGrow: 1, textAlign: 'left', padding: '7px' }}>
        <Grid container justifyContent='space-between' alignItems='center'>
          {/* Left side heading */}
          <Grid item>
            <Typography
              variant='h7'
              color='primary'
              component='div'
              sx={{
                whiteSpace: 'nowrap' /* Prevent text from wrapping */,
                overflow: 'hidden' /* Hide overflow */
                // animation: 'roll 10s linear infinite' /* Animation duration and timing */,
                // '@keyframes roll': {
                //   from: { transform: 'translateX(100%)' } /* Start from the right edge */,
                //   to: { transform: 'translateX(-100%)' } /* Move to the left edge */
                // }
              }}
            >
              {articles.headlines}
            </Typography>
          </Grid>
          {/* Right side date */}
          <Grid item>
            <Typography variant='subtitle1' color='primary'>
              {formattedDate}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {/* <Divider sx={{ marginBottom: 2 }} /> */}
      <Grid container spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {/* Grid for Header Information */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Media Type :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.mediaType}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Publication Type :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.publicationType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Publication :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.publication}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Language :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.language}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Page Number :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.pageNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Size :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.size}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Circulation :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.circulation}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant='body2' color='primary' style={{ display: 'inline' }}>
            Edition :
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ display: 'inline', marginLeft: '4px' }}>
            {articles.edition}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

export default PublicationInfo
