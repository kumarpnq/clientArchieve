import React from 'react'
import { Box, CircularProgress, Grid, Paper } from '@mui/material'
import { TestCard } from './components/ContentCard'
import CompanyCard from './components/CompanyCard'

const DataCard = ({ cardData, setCardData, isSelectCard, selectedCards, setSelectedCards, loading }) => {
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
    <Box>
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
          {cardData.map(parent => (
            <Grid container spacing={1} key={parent.id}>
              <CompanyCard companyTitle={parent.name} companyId={parent.id} setCardData={setCardData} />
              {parent?.feeds?.map(item => (
                <Grid item xs={12} md={6} key={item._id}>
                  <TestCard
                    item={item}
                    onCardSelect={handleCardSelect}
                    isSelectCard={isSelectCard}
                    selectedCards={selectedCards}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </>
      )}
    </Box>
  )
}

export default DataCard
