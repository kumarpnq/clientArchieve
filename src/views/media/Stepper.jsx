import { Icon } from '@iconify/react'
import { Box, Paper } from '@mui/material'
import React from 'react'

const Stepper = () => {
  return (
    <Box component={Paper}>
      <Box>
        <Icon icon={'basil:twitter-outline'} width={50} />
        <Icon icon={'basil:twitter-outline'} width={50} />
        <Icon icon={'basil:twitter-outline'} width={50} />
      </Box>
    </Box>
  )
}

export default Stepper
