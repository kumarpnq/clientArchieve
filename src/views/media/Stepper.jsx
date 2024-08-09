import { Icon } from '@iconify/react'
import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const Stepper = () => {
  return (
    <Box component={Paper}>
      <Box>
        <Typography>
          <Icon icon={'bpajamas:twitter'} width={50} style={{ color: 'blue', cursor: 'pointer' }} />
        </Typography>
        <Icon icon={'basil:twitter-outline'} width={50} style={{ color: 'blue' }} />
        <Icon icon={'iconoir:facebook'} width={50} style={{ color: 'blue' }} />
        <Icon icon={'arcticons:youtube-music'} width={50} style={{ color: 'blue' }} />
        <Icon icon={'iconoir:instagram'} width={50} style={{ color: 'blue' }} />
        <Icon icon={'ph:pinterest-logo-thin'} width={50} style={{ color: 'blue' }} />
        <Icon icon={'ph:tiktok-logo-thin'} width={50} style={{ color: 'blue' }} />
      </Box>
    </Box>
  )
}

export default Stepper
