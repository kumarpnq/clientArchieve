// FullScreenPDFDialog.js
import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import PublicationInfo from './PublicationInfo'
import PublicationLogo from './PublicationLogo'

const FullScreenPDFDialog = ({ open, handleClose, pdfSrc, articles }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true) // Reset loading to true when the dialog is opened

    if (pdfSrc) {
      setLoading(false) // Set loading to false when the PDF source is available
    }
  }, [open, pdfSrc])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='2xl' fullWidth>
      <DialogContent>
        <PublicationLogo articles={articles} />
        <PublicationInfo articles={articles} />
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        ) : (
          <iframe title='PDF Viewer' src={pdfSrc} width='100%' height='600px' />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FullScreenPDFDialog
