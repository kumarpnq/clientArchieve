import React, { useState } from 'react'
import WordCloud from 'react-wordcloud'
import CircularProgress from '@mui/material/CircularProgress'
import useClientWiseWordCloud from 'src/api/dashboard-analytics/useClientWiseWordCloud'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'

const AnalyticsWordCloud = () => {
  const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [companies, setCompanies] = useState([])
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([])

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)

  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''

  const { clientWiseWordCloud, loading, error } = useClientWiseWordCloud()

  const handleSelectAllCompetitions = () => {
    const allCompanyIds = companies.map(company => company.companyId)
    setSelectedCompanyIds(allCompanyIds)
  }

  const handleDeselectAllCompetitions = () => {
    setSelectedCompanyIds([])
  }

  const callbacks = {
    getWordColor: word => (word.value > 50 ? 'blue' : 'red'),
    onWordClick: console.log,
    onWordMouseOver: console.log,
    getWordTooltip: word => `${word.text} (${word.value}) [${word.value > 50 ? 'good' : 'bad'}]`
  }

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [12, 48]
  }

  const size = [600, 400]

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Card sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 2 }}>
        <Typography color={'primary'}>{priorityCompanyName}</Typography>
        <Menu
          open={Boolean(competitionAnchor)}
          anchorEl={competitionAnchor}
          onClose={() => closeDropdown(setCompetitionAnchor)}
        >
          {companies.length > 0 && (
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <Button onClick={handleSelectAllCompetitions}>Select All</Button>
              <Button onClick={handleDeselectAllCompetitions}>Deselect All</Button>
            </ListItem>
          )}

          {companies.map(company => (
            <MenuItem
              key={company.companyId}
              onClick={() => handleCheckboxChange(company.companyId)}
              selected={selectedCompanyIds.includes(company.companyId)}
            >
              {company.companyName}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <WordCloud
          words={clientWiseWordCloud.map(({ word, size }) => ({ text: word, value: size }))}
          options={options}
          size={size}
        />
      )}
    </Card>
  )
}

export default AnalyticsWordCloud
