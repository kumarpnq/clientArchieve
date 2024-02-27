// FullScreenDialog.js (updated for MUI with Grid)

import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import PublicationInfo from './PublicationInfo'
import PublicationLogo from './PublicationLogo'

const FullScreenJPGDialog = ({ open, handleClose, imageSrc, articles }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (imageSrc) {
      setLoading(false)
    }
  }, [open, imageSrc])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
      <DialogContent>
        <PublicationLogo articles={articles} />
        {/* Render the PublicationInfo component and pass the articles prop */}
        <PublicationInfo articles={articles} />

        {/*<Divider sx={{ marginTop: 2 }} />*/}
        {/* Box for Image */}
        <Box mt={2}>
          {/* Conditional rendering of loader */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <CircularProgress />
            </div>
          ) : (
            <img src={imageSrc} alt='JPG Image' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FullScreenJPGDialog
