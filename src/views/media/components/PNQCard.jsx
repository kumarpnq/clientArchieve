import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const Logo = () => {
  return (
    <Typography>
      <span style={{ color: 'gray' }}>PERCEPTION</span>
      <span style={{ color: 'red' }}>&</span>
      <span style={{ color: 'lightgrey' }}>QUANT</span>
    </Typography>
  )
}

const PNQCard = () => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, my: 1, px: 3 }}
      component={Paper}
    >
      <Logo />
      <Logo />
    </Box>
  )
}

export default PNQCard
