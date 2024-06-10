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
import useDelete from 'src/api/online-headline/delete/useDelete'
import CircularProgress from '@mui/material/CircularProgress'

// ** third party import
import toast from 'react-hot-toast'

// ** redux import
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const DeleteDialog = ({ open, onClose, selectedArticles, setDataFetchFlag, dataFetchFlag }) => {
  const [password, setPassword] = useState('')
  const { response, loading, error, deleteSocialFeeds } = useDelete()

  //redux states
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const handleConfirm = async () => {
    // Validate password input
    if (!password.trim()) {
      toast.error('Please enter your password for confirmation.')

      return
    }

    const socialFeedIds = selectedArticles.length > 0 && selectedArticles.map(item => item.socialFeedId).join(',')

    try {
      await deleteSocialFeeds({ clientId, password, socialFeedIds })
      if (response) {
        toast.success(response?.status?.message)
        setPassword('')
        setDataFetchFlag(!dataFetchFlag)
        onClose()
      } else {
        toast.error('An error occurred while deleting articles')
      }
    } catch (error) {
      console.error('Delete article error:', error)
      toast.error('An error occurred while deleting articles.')
    }
  }

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
          {loading ? <CircularProgress /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
