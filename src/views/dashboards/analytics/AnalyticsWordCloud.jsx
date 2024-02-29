import React, { useEffect, useState } from 'react'
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
import useMediaQuery from '@mui/material/useMediaQuery'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'

// ** Redux
import { useSelector } from 'react-redux' // Import useSelector from react-redux
import { selectSelectedClient } from 'src/store/apps/user/userSlice'
import { BASE_URL } from 'src/api/base'

const AnalyticsWordCloud = () => {
  const [competitionAnchor, setCompetitionAnchor] = useState(null)
  const [companies, setCompanies] = useState([])
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([])
  const { clientWiseWordCloud, loading } = useClientWiseWordCloud(selectedCompanyIds)

  //Redux call
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null

  const priorityCompanyName = selectedClient ? selectedClient.priorityCompanyName : ''
  const priorityCompanyId = selectedClient ? selectedClient.priorityCompanyId : ''

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleSelectAllCompetitions = () => {
    const allCompanyIds = companies.map(company => company.companyId)
    setSelectedCompanyIds(allCompanyIds)
  }

  const handleDeselectAllCompetitions = () => {
    setSelectedCompanyIds([])
  }

  const openDropdown = (event, anchorSetter) => {
    anchorSetter(event.currentTarget)
  }

  const closeDropdown = anchorSetter => {
    anchorSetter(null)
  }

  const handleCheckboxChange = companyId => {
    setSelectedCompanyIds(prevSelected => {
      const isAlreadySelected = prevSelected.includes(companyId)

      if (isAlreadySelected) {
        // If already selected, remove from the list
        return prevSelected.filter(id => id !== companyId)
      } else {
        // If not selected, add to the list
        return [...prevSelected, companyId]
      }
    })
  }
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')

        const response = await axios.get(`${BASE_URL}/companyListByClient/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            clientId: clientId
          }
        })
        const fetchedCompanies = response.data.companies
        setCompanies(fetchedCompanies)
      } catch (error) {
        console.log({ 'Error in Fetching Competitions': error })
      }
    }
    fetchCompetitions()
  }, [clientId])

  // const callbacks = {
  //   getWordColor: word => (word.value > 50 ? 'blue' : 'red'),
  //   onWordClick: console.log,
  //   onWordMouseOver: console.log,
  //   getWordTooltip: word => `${word.text} (${word.value}) [${word.value > 50 ? 'good' : 'bad'}]`
  // }

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [12, 48]
  }

  const size = [500, 400]

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Card sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 2 }}>
        <Typography color={'primary'}>{priorityCompanyName}</Typography>
        {isMobile ? (
          <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setCompetitionAnchor)} color='inherit'>
            Competition
          </Button>
        ) : (
          <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setCompetitionAnchor)} color='inherit'>
            Competition
          </Button>
        )}
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
              selected={selectedCompanyIds.includes(company.companyId) || company.companyId === priorityCompanyId}
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
