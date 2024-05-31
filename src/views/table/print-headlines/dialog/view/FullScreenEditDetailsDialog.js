// FullScreenEditDetailsDialog.js

import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PublicationInfo from './PublicationInfo'

import CircularProgress from '@mui/material/CircularProgress'
import PublicationLogo from './PublicationLogo'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import StepperMain from '../editStep/StepperMain'

const FullScreenEditDetailsDialog = ({ open, handleClose, imageSrc, articles, fetchTagsFlag, setFetchTagsFlag }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (imageSrc) {
      setLoading(false)
    }
  }, [open, imageSrc])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='2xl' fullWidth>
      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 2, top: 2 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent container spacing={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PublicationLogo articles={articles} />
          </Grid>
          <Grid item xs={12}>
            <PublicationInfo articles={articles} />
          </Grid>
          <Grid item xs={12}>
            {' '}
            <DatePickerWrapper>
              <StepperMain articles={articles} fetchFlag={fetchTagsFlag} setFetchFlag={setFetchTagsFlag} />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12}>
            <Card mt={2}>
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
    </Dialog>
  )
}

export default FullScreenEditDetailsDialog
