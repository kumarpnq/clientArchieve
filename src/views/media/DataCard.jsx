import { Box, Paper } from '@mui/material'
import React from 'react'

const Card = () => {
  return (
    <Box component={Paper} width={500} height={70} px={2} my={1}>
      Feeds
    </Box>
  )
}

const DataCard = () => {
  return (
    <Box>
      {[1, 2, 3, 4, 5].map(i => (
        <Card key={i}></Card>
      ))}
    </Box>
  )
}

export default DataCard
