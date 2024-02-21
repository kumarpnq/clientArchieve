// EditDialog.js
import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const EditDialog = ({ open, handleClose, article, handleSave }) => {
  const [editedArticle, setEditedArticle] = useState({
    article: '',
    shortHeading: '',
    description: ''
  })

  useEffect(() => {
    if (article) {
      setEditedArticle({
        article: article.article || '',
        shortHeading: article.shortHeading || '',
        description: article.description || ''
      })
    }
  }, [article])

  const handleDiscard = () => {
    setEditedArticle({
      article: article.article || '',
      shortHeading: article.shortHeading || '',
      description: article.description || ''
    })
    handleClose()
  }

  const handleInputChange = (field, value) => {
    setEditedArticle(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveChanges = () => {
    handleSave(editedArticle)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Article</DialogTitle>
      <DialogContent>
        <TextField
          label='Article'
          value={editedArticle.article}
          onChange={e => handleInputChange('article', e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Short Heading'
          value={editedArticle.shortHeading}
          onChange={e => handleInputChange('shortHeading', e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Description'
          value={editedArticle.description}
          onChange={e => handleInputChange('description', e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDiscard} color='primary'>
          Discard
        </Button>
        <Button onClick={handleSaveChanges} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
