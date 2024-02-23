import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import WarningIcon from '@mui/icons-material/Warning'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'

const DeleteDialog = ({ open, onClose, selectedArticles }) => {
  const [password, setPassword] = useState('')

  const handleConfirm = () => {
    // Perform delete operation or any other logic
    // Make sure to compare the entered password for confirmation
    // You might want to add additional validation as needed

    // Close the dialog
    onClose()
  }

  // Check if selectedArticles is null or empty
  if (!selectedArticles || selectedArticles.length === 0) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <WarningIcon style={{ marginRight: '8px' }} />
          Please Select At Least One Article
        </DialogTitle>
        <DialogContent>
          <DialogContentText>To perform the delete operation, you must select at least one article.</DialogContentText>
          <Box display='flex' justifyContent='center'>
            <Button onClick={onClose} color='primary'>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete?</p>
        <TextField
          label='Password for Confirmation'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color='primary'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
