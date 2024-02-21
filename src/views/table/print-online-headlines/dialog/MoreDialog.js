import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const ViewDialog = ({ open, handleClose, article }) => {
  const handleViewHTML = () => {
    console.log('View HTML:', article)
  }

  const handleViewJPG = () => {
    console.log('View JPG:', article)
  }

  const handleViewPDF = () => {
    console.log('View PDF:', article)
  }

  const handleEditDetails = () => {
    console.log('Edit Details:', article)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        View Options
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogActions>
        <Button onClick={handleViewHTML} color='primary'>
          View HTML
        </Button>
        <Button onClick={handleViewJPG} color='primary'>
          View JPG
        </Button>
        <Button onClick={handleViewPDF} color='primary'>
          View PDF
        </Button>
        <Button onClick={handleEditDetails} color='primary'>
          Edit Details
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewDialog
