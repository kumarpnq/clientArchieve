import React from 'react'
import { Box, CircularProgress, Grid, Paper } from '@mui/material'
import { TestCard } from './components/ContentCard'

const DataCard = ({ cardData, isSelectCard, selectedCards, setSelectedCards, loading }) => {
  const handleCardSelect = (card, isSelected) => {
    setSelectedCards(prevSelected => {
      if (isSelected) {
        return [...prevSelected, card]
      } else {
        return prevSelected.filter(item => item !== card)
      }
    })
  }

  return (
    <Grid container spacing={1}>
      {loading ? (
        <Box
          component={Paper}
          sx={{ height: 200, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {' '}
          {cardData.map(item => (
            <Grid item xs={12} md={6} key={item._id}>
              <TestCard
                item={item}
                onCardSelect={handleCardSelect}
                isSelectCard={isSelectCard}
                selectedCards={selectedCards}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  )
}

export default DataCard
