import React, { useState } from 'react'
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
import Select, { SelectChangeEvent } from '@mui/material/Select'

const TaggingDialog = ({ open, onClose }) => {
  const [tag, setTag] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const handleTagChange = event => {
    setTag(event.target.value)
  }

  const handleTagSelectChange = event => {
    setSelectedTag(event.target.value)
  }

  const handleSave = () => {
    // Handle the save logic here (you can save the tag or perform any other actions)
    console.log('Tag to be saved:', tag)
    console.log('Selected Tag:', selectedTag)

    // Close the dialog
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Tag</DialogTitle>
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
              <MenuItem value='tag1'>Tag 1</MenuItem>
              <MenuItem value='tag2'>Tag 2</MenuItem>
              <MenuItem value='tag3'>Tag 3</MenuItem>
              <MenuItem value='tag4'>Tag 4</MenuItem>
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
