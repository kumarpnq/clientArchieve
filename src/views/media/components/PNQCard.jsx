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

const PNQCard = ({ clientName }) => {
  const ClientName = () => {
    return (
      <Typography variant='body1' color={'primary'} sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
        {clientName}
      </Typography>
    )
  }

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, my: 1, px: 3 }}
      component={Paper}
    >
      <Logo />
      <ClientName />
      <Logo />
    </Box>
  )
}

export default PNQCard
