// FullScreenEditDetailsDialog.js

import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PublicationInfo from './PublicationInfo'

import PublicationLogo from './PublicationLogo'
import Grid from '@mui/material/Grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import StepperMain from '../editStep/StepperMain'
import MultiViewNonProtected from 'src/pages/article-view'

const FullScreenEditDetailsDialog = ({
  open,
  fetchTags,
  handleClose,
  imageSrc,
  articles,
  fetchTagsFlag,
  setFetchTagsFlag,
  setFetchTags
}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (imageSrc) {
      setLoading(false)
    }
  }, [open, imageSrc])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='4xl' fullWidth>
      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 4, top: 2 }}>
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
              <StepperMain
                articles={articles}
                fetchFlag={fetchTagsFlag}
                setFetchFlag={setFetchTagsFlag}
                handleClose={handleClose}
                fetchTags={fetchTags}
                setFetchTags={setFetchTags}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12}>
            <MultiViewNonProtected articleCodeFromTab={articles?.link} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default FullScreenEditDetailsDialog
