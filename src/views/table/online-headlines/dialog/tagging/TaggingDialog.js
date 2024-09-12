import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import WarningIcon from '@mui/icons-material/Warning'
import DialogContentText from '@mui/material/DialogContentText'

// ** Redux
import { useSelector } from 'react-redux'
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import useUpdateTagForMultipleOnlineArticles from 'src/api/online-headline/tag/useUpdateTagForMultipleOnlineArticle'

const TaggingDialog = ({ open, onClose, selectedArticles, tags, fetchTagsFlag, setFetchTagsFlag }) => {
  const [tag, setTag] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const article = selectedArticles.map(({ socialFeedId, companies }) => ({
    socialFeedId: Number(socialFeedId),
    companyIds: companies.map(company => company.id)
  }))

  const { loading, error, responseData, updateTagForMultipleArticles } = useUpdateTagForMultipleOnlineArticles({
    clientId: clientId,
    article: article,
    tag: tag || selectedTag
  })
  useEffect(() => {
    setFetchTagsFlag(!fetchTagsFlag)
  }, [])

  const handleTagChange = event => {
    setTag(event.target.value)
  }

  const handleTagSelectChange = event => {
    setSelectedTag(event.target.value)
  }

  const handleSave = async () => {
    try {
      await updateTagForMultipleArticles()
      setFetchTagsFlag(!fetchTagsFlag)
      setTag('')
      setSelectedTag('')
      onClose()
    } catch (error) {
      console.error('Error updating tags:', error)
      setTag('')
      setSelectedTag('')
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
          <DialogContentText>To perform the tagging operation, you must select at least one article.</DialogContentText>
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
      <DialogTitle color='primary'>Select Tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          id='tag'
          label='Enter Tag'
          type='text'
          fullWidth
          value={tag}
          onChange={handleTagChange}
        />

        <Box sx={{ minWidth: 120, marginTop: '20px' }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Select Tag</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={selectedTag}
              label='Select Tag'
              onChange={handleTagSelectChange}
            >
              {tags.map(tag => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaggingDialog
