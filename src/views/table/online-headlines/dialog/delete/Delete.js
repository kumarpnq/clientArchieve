import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const DeleteDialog = ({ open, onClose }) => {
  const [password, setPassword] = useState('')

  const handleConfirm = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color='primary'>Delete</DialogTitle>
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
