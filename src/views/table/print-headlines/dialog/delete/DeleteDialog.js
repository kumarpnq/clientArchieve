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
import CircularProgress from '@mui/material/CircularProgress'

// ** third party imports
import toast from 'react-hot-toast'
import { useDelete } from 'src/api/print-headlines/delete/useDelete'

// ** redux import
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const DeleteDialog = ({ open, onClose, selectedArticles, setDataFetchFlag }) => {
  const [password, setPassword] = useState('')
  const { response, loading, error, deleteArticle } = useDelete()

  //redux state
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const handleConfirm = async () => {
    // Validate password input
    if (!password.trim()) {
      toast.error('Please enter your password for confirmation.')

      return
    }

    const articleIds = selectedArticles.length > 0 && selectedArticles.map(item => item.articleId).join(',')

    try {
      await deleteArticle({ clientId, password, articleIds })
      response ? toast.success(response?.status?.message) : toast.error(error && error)
      onClose()
      response && setDataFetchFlag(true)
    } catch (error) {
      console.error('Delete article error:', error)
      toast.error('An error occurred while deleting articles.')
    }
    setDataFetchFlag(false)
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
