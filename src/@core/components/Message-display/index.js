import React from 'react'
import { Typography, Box } from '@mui/material'

const MessageDisplay = ({ message, severity }) => {
  if (!message) {
    return null
  }

  return (
    <Box>
      <Typography variant='body2' color={severity === 'error' ? 'error.main' : 'success.main'} textAlign='center'>
        {message}
      </Typography>
    </Box>
  )
}

export default MessageDisplay
