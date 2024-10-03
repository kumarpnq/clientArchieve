import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Popover from '@mui/material/Popover'

const RecordsPerPageSelector = ({ recordsPerPage, handleRecordsPerPageUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [customValue, setCustomValue] = useState('')

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCustomInputChange = event => {
    setCustomValue(event.target.value)
  }

  const handleCustomUpdate = () => {
    if (customValue && !isNaN(customValue)) {
      handleRecordsPerPageUpdate(parseInt(customValue, 10))
      setAnchorEl(null)
    }
  }

  const handlePredefinedUpdate = value => {
    handleRecordsPerPageUpdate(value)
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button endIcon={<ExpandMoreIcon />} onClick={handleClick}>
        Articles: {recordsPerPage}
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {' '}
        <MenuItem onClick={() => handlePredefinedUpdate(100)}>100</MenuItem>
        <MenuItem onClick={() => handlePredefinedUpdate(200)}>200</MenuItem>
        <MenuItem onClick={() => handlePredefinedUpdate(500)}>500</MenuItem>
        <MenuItem>
          <TextField
            label='Custom'
            type='number'
            value={customValue}
            onChange={handleCustomInputChange}
            size='small'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCustomUpdate()
              }
            }}
          />
          {/* <Button size='small' onClick={handleCustomUpdate}>
            Update
          </Button> */}
        </MenuItem>
      </Popover>
    </Box>
  )
}

export default RecordsPerPageSelector
