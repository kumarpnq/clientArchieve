import { Box, IconButton, Paper } from '@mui/material'
import React from 'react'
import XIcon from '@mui/icons-material/X'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import PinterestIcon from '@mui/icons-material/Pinterest'
import FilterBox from './FilterBox'
import styled from '@emotion/styled'

// Styled outer Box component
const StyledOuterBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between  ',
  gap: theme.spacing(2)
}))

const Stepper = () => {
  return (
    <StyledOuterBox>
      <Box>
        <IconButton sx={{ color: 'primary.main' }}>All</IconButton>
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
      <FilterBox />
    </StyledOuterBox>
  )
}

export default Stepper
