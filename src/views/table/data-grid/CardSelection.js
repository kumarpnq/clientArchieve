// ** React Import
import React, { useState } from 'react'

// ** MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TrendingUpIcon from '@mui/icons-material/TrendingUp' // Import TrendingUp icon
import Grid from '@mui/material/Grid'

const cardsData = [
  { title: 'Avendas Capital', description: 'Description for Avendas Capital goes here.' },
  { title: 'Infosys', description: 'Description for Infosys goes here.' },
  { title: 'ITC BSL Group', description: 'Description for ITC BSL Group goes here.' },
  { title: 'IKEA', description: 'Description for IKEA goes here.' }
]

const CardSelection = () => {
  // ** State
  const [isContainerOpen, setContainerOpen] = useState(false)

  const handleOpenContainer = () => {
    setContainerOpen(true)
  }

  const handleCloseContainer = () => {
    setContainerOpen(false)
  }

  return (
    <Card>
      <Toolbar>
        <Button
          startIcon={<TrendingUpIcon />} // Icon placed inside the button
          onClick={handleOpenContainer}
        >
          Latest Competitive News
        </Button>
      </Toolbar>

      {isContainerOpen && (
        <>
          <Grid container spacing={2} justifyContent='center' p={4}>
            {console.log('carddata==>', cardsData)}
            {cardsData.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ width: '100%', height: 270, textAlign: 'center' }}>
                  <CardHeader title={card.title} />
                  <Typography variant='body1'>{card.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box display='flex' justifyContent='center' pb={4}>
            <Button color='primary' onClick={handleCloseContainer}>
              Close
            </Button>
          </Box>
        </>
      )}
    </Card>
  )
}

export default CardSelection
