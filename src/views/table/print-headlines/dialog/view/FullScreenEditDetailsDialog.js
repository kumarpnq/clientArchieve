// FullScreenEditDetailsDialog.js

import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PublicationInfo from './PublicationInfo'
import EditJournalist from './EditJournalist'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import FooterDialog from './FooterDialog'
import PublicationLogo from './PublicationLogo'
import ArticleTagEdit from './ArticleTagEdit'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

const FullScreenEditDetailsDialog = ({ open, handleClose, imageSrc, articles, fetchTagsFlag, setFetchTagsFlag }) => {
  console.log('articles==>', articles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (imageSrc) {
      setLoading(false)
    }
  }, [open, imageSrc])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='2xl' fullWidth>
      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent container spacing={6}>
        <Grid container spacing={6}>
          {/* Wrap the components inside the Box */}
          <Grid item xs={12}>
            <PublicationLogo articles={articles} />
          </Grid>
          <Grid item xs={12}>
            <PublicationInfo articles={articles} />
          </Grid>
          <Grid item xs={12}>
            <EditJournalist handleClose={handleClose} articles={articles} />
          </Grid>
          <Grid item xs={12}>
            <ArticleTagEdit
              setFetchTagsFlag={setFetchTagsFlag}
              fetchTagsFlag={fetchTagsFlag}
              articles={articles}
              handleClose={handleClose}
            />
          </Grid>

          <Grid item xs={12}>
            <Card mt={2}>
              {/* Conditional rendering of loader */}
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <CircularProgress />
                </div>
              ) : (
                <img src={imageSrc} alt='JPG Image' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <FooterDialog />
    </Dialog>
  )
}

export default FullScreenEditDetailsDialog
