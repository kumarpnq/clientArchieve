import { Icon } from '@iconify/react'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import React from 'react'
import XIcon from '@mui/icons-material/X'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import PinterestIcon from '@mui/icons-material/Pinterest'

const Stepper = () => {
  return (
    <Box component={Paper}>
      <Box>
        <IconButton sx={{ color: 'primary.main' }}>
          <XIcon fontSize='large' />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <FacebookIcon fontSize='large' />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <YouTubeIcon fontSize='large' />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <InstagramIcon fontSize='large' />
        </IconButton>
        <IconButton sx={{ color: 'primary.main', fontSize: 35 }}>
          <PinterestIcon fontSize='large' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Stepper
