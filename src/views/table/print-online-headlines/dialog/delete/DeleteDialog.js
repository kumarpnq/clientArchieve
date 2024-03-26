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

import useDelete from 'src/api/print-online-headlines/delete/useDelete'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const DeleteDialog = ({ open, onClose, selectedArticles, dataFetchFlag, setDataFetchFlag }) => {
  const [password, setPassword] = useState('')
  const { response, loading, error, deleteArticlesAndSocialFeeds } = useDelete()
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const handleConfirm = async () => {
    if (!password.trim()) {
      toast.error('Please enter your password for confirmation.')

      return
    }

    const articleTypeAndIds =
      selectedArticles.length > 0 &&
      selectedArticles.map(item => ({ id: String(item.articleId), type: item.articleType }))

    try {
      await deleteArticlesAndSocialFeeds({ clientId, password, articleTypeAndIds })
      response.status.message ? toast.success('Record Deleted') : toast.error(error)
      onClose()
      response && setDataFetchFlag(!dataFetchFlag)
    } catch (error) {
      toast.error('An error occurred while deleting articles.')
    } finally {
      setDataFetchFlag(!dataFetchFlag)
      setPassword('')
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
          {loading ? <CircularProgress /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
