import { Icon } from '@iconify/react'
import { Box, Paper } from '@mui/material'
import React from 'react'

const Stepper = () => {
  return (
    <Box component={Paper}>
      <Box>
        <Icon icon={'bpajamas:twitter'} width={50} />
        <Icon icon={'basil:twitter-outline'} width={50} />
        <Icon icon={'iconoir:facebook'} width={50} />
        <Icon icon={'arcticons:youtube-music'} width={50} />
        <Icon icon={'iconoir:instagram'} width={50} />
        <Icon icon={'ph:pinterest-logo-thin'} width={50} />
        <Icon icon={'ph:tiktok-logo-thin'} width={50} />
      </Box>
    </Box>
  )
}

export default Stepper
